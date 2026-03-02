import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google, gmail_v1 } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const PENDING_DIR = path.join(process.cwd(), 'fetch_raw', 'pending');
const PROCESSED_DIR = path.join(process.cwd(), 'fetch_raw', 'processed');

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
async function saveCredentials(client: any) {
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

async function authorize() {
  let client: any = await loadSavedCredentialsIfExist();
  if (client) {
    try {
      // Force a token refresh to check if the credentials are still valid
      await client.getAccessToken();
      return client;
    } catch (err: any) {
      // If we get an invalid_grant error, the refresh token is no longer valid
      if (err.message?.includes('invalid_grant') || err.response?.data?.error === 'invalid_grant') {
        console.warn('Saved token is invalid or expired. Starting new authentication flow...');
        try {
          await fs.unlink(TOKEN_PATH);
        } catch (unlinkErr) {
          // Ignore error if file doesn't exist
        }
        client = null;
      } else {
        throw err;
      }
    }
  }

  // If no valid client from saved credentials, start authentication flow
  if (!client) {
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
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
    const res: any = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      pageToken: pageToken,
      maxResults: 100,
    });
    if (res.data.messages) {
      allMessages = allMessages.concat(res.data.messages);
    }
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return allMessages;
}

async function getMessage(gmail: gmail_v1.Gmail, id: string) {
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: id,
    format: 'full',
  });
  return res.data;
}

async function run() {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth: auth as any });

    // Parse command line arguments
    const args = process.argv.slice(2);
    let days = 30;
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

    let query = 'subject:("主日祟拜" OR "主日崇拜") "主日崇拜程序 Program"';
    
    if (useDateFilter) {
      const afterDate = new Date();
      afterDate.setDate(afterDate.getDate() - days);
      const afterStr = `${afterDate.getFullYear()}/${String(afterDate.getMonth() + 1).padStart(2, '0')}/${String(afterDate.getDate()).padStart(2, '0')}`;
      query += ` after:${afterStr}`;
      console.log(`Searching for worship emails since ${afterStr} (${days} days)...`);
    } else {
      console.log('Searching for all worship emails (no date filter)...');
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
