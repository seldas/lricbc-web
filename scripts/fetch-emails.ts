import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google, Auth, gmail_v1 } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const PENDING_DIR = path.join(process.cwd(), 'fetch_raw', 'pending');
const PROCESSED_DIR = path.join(process.cwd(), 'fetch_raw', 'processed');

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist(): Promise<Auth.OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as Auth.OAuth2Client;
  } catch {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
async function saveCredentials(client: Auth.OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize(): Promise<Auth.OAuth2Client> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    try {
      // Force a token refresh to check if the credentials are still valid
      await client.getAccessToken();
      return client;
    } catch (error) {
      const err = error as { message?: string; response?: { data?: { error?: string } } };
      // If we get an invalid_grant error, the refresh token is no longer valid
      if (err.message?.includes('invalid_grant') || err.response?.data?.error === 'invalid_grant') {
        console.warn('Saved token is invalid or expired. Starting new authentication flow...');
        try {
          await fs.unlink(TOKEN_PATH);
        } catch {
          // Ignore error if file doesn't exist
        }
        client = null;
      } else {
        throw error;
      }
    }
  }

  // If no valid client from saved credentials, start authentication flow
  if (!client) {
    const authenticatedClient = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    client = authenticatedClient as unknown as Auth.OAuth2Client;
    if (client.credentials) {
      await saveCredentials(client);
    }
  }
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
    const auth = await authorize();
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

    let query = 'subject:("Sunday bulletin" OR "Sunday Newsletter")';
    
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
