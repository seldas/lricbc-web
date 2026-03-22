# Weekly Content Update Guide

This document outlines the steps required to update the LRICBC website with the latest worship programs and pastor's messages from Gmail.

## 1. Fetch Latest Emails

By default, the script now only searches the last **30 days** of emails to ensure fast weekly updates.

### Local Environment
Run the following command in the `lricbc-web` directory:
```bash
npm run fetch-updates
```

**Options:**
- To search a specific number of days: `npm run fetch-updates -- --days 7`
- To search all history: `npm run fetch-updates -- --all`

### GCP / Production
If running inside the container or via a CI/CD pipeline, ensure `credentials.json` and `token.json` are present in the root. The command is the same:
```bash
npm run fetch-updates
```

---

## 2. Process Emails into Content

This step parses the downloaded JSON files in the `pending/` directory and generates Markdown files in `src/content/updates/`.

```bash
npm run process-updates
```

---

## 3. Verify Changes

Check the `src/content/updates/` directory for new `.md` files. You can run the development server to see how they look:
```bash
npm run dev
```

---

## 4. Deployment

### Local Version (Testing/Dev)
No further steps are needed once the Markdown files are generated; Next.js will pick them up.

### GCP Platform (Production)
Since this project uses a mounted Google Cloud Storage bucket for content, you can update the live website **without rebuilding the application**. This is much faster for weekly updates.

1. **Commit your changes (Optional but recommended):**
   ```bash
   git add .
   git commit -m "docs: add weekly updates for [Date]"
   ```

2. **Sync content to the cloud:**
   This will upload all Markdown content (`updates`, `testimonies`, `special-events`), gallery images, and announcements directly to the production storage.

   **For Linux / macOS:**
   ```bash
   chmod +x sync-content.sh
   ./sync-content.sh
   ```

   **For Windows (PowerShell):**
   ```powershell
   ./sync-content.ps1
   ```

3. **When to use full Deployment?**
   Only use `./deploy.sh` or `./deploy.ps1` if you have changed the **application code** (e.g., changed the UI layout, fixed a bug in the TypeScript code, or updated `package.json`). For 99% of weekly content updates, the `sync-content` scripts are sufficient.

---

## Troubleshooting

- **No emails found:** Verify the lookback period using `--days 60` or `--all`.
- **Authentication Error:** If `token.json` is expired or invalid, delete it and run `npm run fetch-updates` locally to trigger a new browser-based OAuth flow.
- **Parsing Issues:** If a specific email fails to process, check `scripts/process-emails.ts` for updated markers (e.g., if the email subject or structure changed).

## For any questions, please reach out to chinesechurch@icbc.org