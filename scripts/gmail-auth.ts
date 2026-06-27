/**
 * One-time script to obtain a Gmail refresh token for church@lricbc.org.
 * Run once: npm run gmail-auth
 * Copy the printed refresh token into .env as GMAIL_REFRESH_TOKEN.
 * You never need to run this again unless the token is revoked.
 */
import { config as loadEnv } from 'dotenv';
import { google } from 'googleapis';
import * as http from 'http';
import * as url from 'url';

loadEnv();

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const REDIRECT_URI = 'http://localhost:3001/oauth2callback';

async function main() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Error: GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in .env');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // force refresh token to be returned
    login_hint: 'church@lricbc.org',
  });

  console.log('\nOpen this URL in your browser and sign in as church@lricbc.org:\n');
  console.log(authUrl);
  console.log('\nWaiting for callback...\n');

  // Temporary local server to capture the OAuth callback
  await new Promise<void>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const parsed = url.parse(req.url || '', true);
        const code = parsed.query.code as string;

        if (!code) {
          res.end('No code received.');
          return;
        }

        const { tokens } = await oauth2Client.getToken(code);

        res.end('<h2>Success! You can close this tab.</h2>');
        server.close();

        console.log('\n✅ Refresh token obtained. Add this to your .env file:\n');
        console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);
        resolve();
      } catch (err) {
        res.end('Error obtaining token.');
        reject(err);
      }
    });

    server.listen(3001, () => {
      console.log('Local callback server listening on http://localhost:3001');
    });
  });
}

main();
