# Weekly Content Update Guide

This document outlines the steps to update the LRICBC website with the latest worship programs and pastor's messages.

## Authentication Setup (One-time)

The fetch script reads `church@lricbc.org` Gmail using OAuth credentials stored as environment variables — no browser login required on subsequent runs.

### Step 1: Create OAuth credentials in Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: add `http://localhost:3001/oauth2callback`
3. Copy the **Client ID** and **Client Secret** into `.env`:
   ```
   GMAIL_CLIENT_ID=your-client-id
   GMAIL_CLIENT_SECRET=your-client-secret
   ```
4. Make sure the **Gmail API** is enabled: [Enable it here](https://console.cloud.google.com/apis/library/gmail.googleapis.com)

### Step 2: Obtain the refresh token (once only)

```powershell
npm run gmail-auth
```

Sign in as `church@lricbc.org`, approve access, then copy the printed token into `.env`:
```
GMAIL_REFRESH_TOKEN=your-refresh-token
```

### For Production (Cloud Run)

Set `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` as environment variables in the Cloud Run service config.

---

## Weekly Update Workflow

### Step 1 — Fetch emails

Pulls new bulletin emails from `church@lricbc.org` into `fetch_raw/pending/`.

```powershell
npm run fetch-updates
```

Options:
- `npm run fetch-updates -- --days 14` — extend the lookback window
- `npm run fetch-updates -- --all` — fetch entire history

### Step 2 — Process with Claude (Cowork)

Open the **Church-Website** project in Claude Cowork and say:

> "Process the pending emails"

Claude will read the files in `fetch_raw/pending/`, extract the pastor's message and worship program, and write formatted bilingual markdown to `content/updates/`. Processed files are moved to `fetch_raw/processed/`.

### Step 3 — Verify

Review the new `.md` files in `content/updates/`, or run the dev server to preview:

```powershell
npm run dev
```

### Step 4 — Sync to production

```powershell
# Windows
./sync-content.ps1

# macOS / Linux
./sync-content.sh
```

This pushes content to GCS and the live site updates immediately — no rebuild needed.

Only run `./deploy.ps1` (full rebuild) if application code changed.

---

## Troubleshooting

- **No emails found:** Try `--days 60` or `--all`.
- **Auth error:** Check `.env` has all three Gmail vars. If refresh token was revoked (e.g. after a password change), re-run `npm run gmail-auth`.
- **Processing issues:** Open Cowork and describe the problem — Claude can inspect the raw JSON in `fetch_raw/pending/` directly.

---

For questions contact: church@lricbc.org
