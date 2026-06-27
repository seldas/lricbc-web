/**
 * One-time script to obtain a GCS refresh token for chinesechurch.lr@gmail.com.
 * Run once: npm run gcs-auth
 * Copy the printed refresh token into .env as GCS_REFRESH_TOKEN.
 *
 * Uses the same OAuth client as Gmail auth, but with storage scope
 * and signed in as chinesechurch.lr@gmail.com (the GCP project owner).
 */
import { config as loadEnv } from 'dotenv';
import { google } from 'googleapis';
import * as http from 'http';
import * as url from 'url';

loadEnv();

const SCOPES = ['https://www.googleapis.com/auth/devstorage.read_write'];
const REDIRECT_URI = 'http://localhost:3001/oauth2callback';

async function main() {
  const clientId = process.env.GCS_CLIENT_ID || process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GCS_CLIENT_SECRET || process.env.GMAIL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Error: GCS_CLIENT_ID and GCS_CLIENT_SECRET must be set in .env');
    console.error('(Falls back to GMAIL_CLIENT_ID/GMAIL_CLIENT_SECRET if GCS-specific ones are not set)');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    login_hint: 'chinesechurch.lr@gmail.com',
  });

  console.log('\nOpen this URL in your browser and sign in as chinesechurch.lr@gmail.com:\n');
  console.log(authUrl);
  console.log('\nWaiting for callback...\n');

  await new Promise<void>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const parsed = url.parse(req.url || '', true);
        const code = parsed.query.code as string;
        if (!code) { res.end('No code received.'); return; }

        const { tokens } = await oauth2Client.getToken(code);
        res.end('<h2>Success! You can close this tab.</h2>');
        server.close();

        console.log('\nRefresh token obtained. Add this to your .env file:\n');
        console.log(`GCS_REFRESH_TOKEN=${tokens.refresh_token}\n`);
        resolve();
      } catch (err) {
        res.end('Error obtaining token.');
        reject(err);
      }
    });
    server.listen(3001, () => console.log('Listening on http://localhost:3001'));
  });
}

main();
