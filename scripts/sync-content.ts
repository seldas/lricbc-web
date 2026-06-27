/**
 * Syncs local content directories to GCS bucket lricbc-web-storage.
 * Replicates what sync-content.sh does via gcloud storage rsync.
 *
 * Auth: uses GCS_REFRESH_TOKEN (chinesechurch.lr@gmail.com) from .env.
 * Run: npm run sync-content
 */
import fs from 'fs/promises';
import path from 'path';
import { config as loadEnv } from 'dotenv';
import { Storage } from '@google-cloud/storage';
import { OAuth2Client } from 'google-auth-library';

loadEnv();

const BUCKET = 'lricbc-web-storage';
const PROJECT = 'lricbc-web';

// Directories to sync: [localPath, gcsPrefix, excludePattern?]
const SYNC_DIRS: [string, string, RegExp?][] = [
  ['content',             'content'],
  ['fetch_raw',           'fetch_raw'],
  ['public/announcements','public/announcements'],
  ['public/gallery',      'public/gallery', /metadata\.sample\.json$/],
  ['public/logo',         'public/logo'],
];

function authorize() {
  const clientId = process.env.GCS_CLIENT_ID || process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GCS_CLIENT_SECRET || process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GCS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing GCS credentials. Ensure GCS_REFRESH_TOKEN (and GCS_CLIENT_ID/GCS_CLIENT_SECRET ' +
      'or GMAIL_CLIENT_ID/GMAIL_CLIENT_SECRET) are set in .env.\n' +
      'Run: npm run gcs-auth'
    );
  }

  const authClient = new OAuth2Client(clientId, clientSecret);
  authClient.setCredentials({ refresh_token: refreshToken });
  return authClient;
}

async function listLocalFiles(dir: string, exclude?: RegExp): Promise<string[]> {
  const files: string[] = [];
  async function walk(current: string) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return; // directory doesn't exist
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (!exclude || !exclude.test(relPath)) {
        files.push(relPath);
      }
    }
  }
  await walk(dir);
  return files;
}

async function syncDir(
  storage: Storage,
  localDir: string,
  gcsPrefix: string,
  exclude?: RegExp
) {
  const absLocal = path.join(process.cwd(), localDir);
  const files = await listLocalFiles(absLocal, exclude);

  if (files.length === 0) {
    console.log(`  (no files in ${localDir})`);
    return;
  }

  const bucket = storage.bucket(BUCKET);
  let uploaded = 0;

  for (const relPath of files) {
    const localFile = path.join(absLocal, relPath);
    const gcsPath = `${gcsPrefix}/${relPath}`;

    await bucket.upload(localFile, {
      destination: gcsPath,
      resumable: false,
    });
    uploaded++;
  }

  console.log(`  ${localDir} → gs://${BUCKET}/${gcsPrefix}  (${uploaded} files)`);
}

async function run() {
  console.log('Starting content sync to GCS...\n');

  const authClient = authorize();
  const storage = new Storage({
    projectId: PROJECT,
    authClient: authClient as never,
  });

  for (const [localDir, gcsPrefix, exclude] of SYNC_DIRS) {
    process.stdout.write(`Syncing ${localDir}... `);
    try {
      await syncDir(storage, localDir, gcsPrefix, exclude);
    } catch (err) {
      console.error(`\n  Error syncing ${localDir}:`, err);
    }
  }

  console.log('\nSync complete.');
}

run();
