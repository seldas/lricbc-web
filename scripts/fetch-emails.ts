import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { config as loadEnv } from 'dotenv';
import { google, Auth, gmail_v1 } from 'googleapis';

// Load .env file for local development (no-op in production where env vars are set directly)
loadEnv();

// Auth uses church@lricbc.org OAuth credentials stored as env vars.
// Required env vars:
//   GMAIL_CLIENT_ID      - OAuth client ID
//   GMAIL_CLIENT_SECRET  - OAuth client secret
//   GMAIL_REFRESH_TOKEN  - refresh token obtained from one-time browser login
//
// Locally: put these in a .env file (gitignored).
// Production (Cloud Run): set them in the service's environment variables.
const PENDING_DIR = path.join(process.cwd(), 'fetch_raw', 'pending');
const PROCESSED_DIR = path.join(process.cwd(), 'fetch_raw', 'processed');

function authorize(): Auth.OAuth2Client {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing required env vars: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN\n' +
      'Add them to your .env file locally, or to the Cloud Run environment variables in production.'
    );
  }

  const client = new google.auth.OAuth2(clientId, clientSecret);
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

async function listMessages(gmail: gmail_v1.Gmail, query: string) {
  let allMessages: gmail_v1.Schema$Message[] = [];
  let pageToken: string | undefined;

  do {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      pageToken,
      maxResults: 100,
    });
    const data = res.data;
    if (data.messages) {
      allMessages = allMessages.concat(data.messages);
    }
    pageToken = data.nextPageToken || undefined;
  } while (pageToken);

  return allMessages;
}

async function getMessage(gmail: gmail_v1.Gmail, id: string) {
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: id,
    format: 'full',
  });
  const message = res.data;

  // Recursively fetch attachment data
  async function fetchAttachments(parts: gmail_v1.Schema$MessagePart[]) {
    for (const part of parts) {
      if (part.filename && part.body?.attachmentId) {
        console.log(`  - Fetching attachment: ${part.filename}`);
        const attachment = await gmail.users.messages.attachments.get({
          userId: 'me',
          messageId: id,
          id: part.body.attachmentId,
        });
        part.body.data = attachment.data.data;
      }
      if (part.parts) {
        await fetchAttachments(part.parts);
      }
    }
  }

  if (message.payload?.parts) {
    await fetchAttachments(message.payload.parts);
  } else if (message.payload?.body?.attachmentId) {
    // Single part message with attachment
    const attachment = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: id,
      id: message.payload.body.attachmentId,
    });
    message.payload.body.data = attachment.data.data;
  }

  return message;
}

async function run() {
  try {
    const auth = authorize();
    const gmail = google.gmail({ version: 'v1', auth });

    // Parse command line arguments
    const args = process.argv.slice(2);
    let days = 7;
    let useDateFilter = true;

    if (args.includes('--all')) {
      useDateFilter = false;
    } else {
      const daysIdx = args.indexOf('--days');
      if (daysIdx !== -1 && args[daysIdx + 1]) {
        days = parseInt(args[daysIdx + 1]);
      }
    }

    // Ensure directories exist
    await fs.mkdir(PENDING_DIR, { recursive: true });
    await fs.mkdir(PROCESSED_DIR, { recursive: true });

    let query = 'subject:("Sunday bulletin" OR "Sunday Newsletter" OR "主日崇拜" OR "主日祟拜" OR "bulletin" OR "newsletter")';
    
    if (useDateFilter) {
      const afterDate = new Date();
      afterDate.setDate(afterDate.getDate() - days);
      const afterStr = `${afterDate.getFullYear()}/${String(afterDate.getMonth() + 1).padStart(2, '0')}/${String(afterDate.getDate()).padStart(2, '0')}`;
      query += ` after:${afterStr}`;
      console.log(`Searching for update emails since ${afterStr} (${days} days)...`);
    } else {
      console.log('Searching for all update emails (no date filter)...');
    }

    const messages = await listMessages(gmail, query);

    if (messages.length === 0) {
      console.log('No matching emails found.');
      return;
    }

    console.log(`Found ${messages.length} messages. Downloading new ones...`);

    for (const msg of messages) {
      const msgId = msg.id!;
      const pendingPath = path.join(PENDING_DIR, `${msgId}.json`);
      const processedPath = path.join(PROCESSED_DIR, `${msgId}.json`);

      // Check if we already have this message in pending or processed
      try {
        await fs.access(pendingPath);
        continue;
      } catch {}

      try {
        await fs.access(processedPath);
        continue;
      } catch {}

      console.log(`Downloading message ${msgId}...`);
      const fullMsg = await getMessage(gmail, msgId);
      
      // Save the raw JSON response
      await fs.writeFile(pendingPath, JSON.stringify(fullMsg, null, 2));
      console.log(`Saved to ${pendingPath}`);
    }

    console.log('Fetch complete.');
  } catch (error) {
    console.error('Error in script:', error);
  }
}

run();
