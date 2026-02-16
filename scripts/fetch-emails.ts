import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google, gmail_v1 } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const PENDING_DIR = path.join(process.cwd(), 'pending');

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
    client_secret: key.client_id_secret, // Fix for local-auth payload
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Actually saveCredentials needs some small fix because the payload structure 
 * might differ slightly. Correcting it here based on standard Google OAuth2 structure.
 */
async function saveCredentialsCorrected(client: any) {
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
  let client: any = null;
  client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentialsCorrected(client);
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

    // Ensure pending directory exists
    await fs.mkdir(PENDING_DIR, { recursive: true });

    console.log('Searching for worship emails...');
    // Query: Broaden to catch variations and both "祟" (Suì) and "崇" (Chóng)
    // AND require the specific Program string in the body
    const query = 'subject:("主日祟拜" OR "主日崇拜") "主日崇拜程序 Program"'; 
    const messages = await listMessages(gmail, query);

    if (messages.length === 0) {
      console.log('No matching emails found.');
      return;
    }

    console.log(`Found ${messages.length} messages. Downloading new ones...`);

    for (const msg of messages) {
      const msgId = msg.id!;
      const filePath = path.join(PENDING_DIR, `${msgId}.json`);

      // Check if we already processed this message
      try {
        await fs.access(filePath);
        // console.log(`Message ${msgId} already exists, skipping.`);
        continue;
      } catch {
        // File doesn't exist, proceed to download
      }

      console.log(`Downloading message ${msgId}...`);
      const fullMsg = await getMessage(gmail, msgId);
      
      // Save the raw JSON response
      await fs.writeFile(filePath, JSON.stringify(fullMsg, null, 2));
      console.log(`Saved to ${filePath}`);
    }

    console.log('Fetch complete.');
  } catch (error) {
    console.error('Error in script:', error);
  }
}

run();
