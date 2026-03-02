# LRICBC Web Application

This is the official web application for the **Little Rock Immanuel Chinese Baptist Church (LRICBC)**. The platform serves as a central hub for the congregation, providing access to bilingual worship programs, pastor's messages, and church updates.

Currently hosted at [lricbc-web-1005010236942.us-central1.run.app](https://lricbc-web-1005010236942.us-central1.run.app/)  
Will move to [lricbc.org](https://lricbc.org) when officially online

## Key Features

- **Automated Content Integration:** Synchronizes directly with church records (Gmail) to fetch and process weekly worship materials.
- **Bilingual Support:** Fully supports English and Chinese (Traditional) content for all worship programs and pastor's messages.
- **Responsive Design:** Optimized for both desktop and mobile viewing to ensure the congregation can access materials anywhere.
- **Media Sharing:** Integration with Google Photos to share church event photos and videos with the congregation.
- **Statement of Faith:** Integrated bilingual [Baptist Faith and Message 2000](/faith) page for the congregation.
- **Archive Management:** Automatically generates a searchable history of past sermons and messages.

## Weekly Content Updates

The app includes specialized scripts to automate the flow from church communications to web content.

- **Smart Fetching:** The system defaults to a **30-day lookback** for new emails to ensure updates are fast and efficient.
- **Automated Processing:** Raw email data is automatically parsed, cleaned, and converted into Markdown format for the website.

### How to Update
For detailed, step-by-step instructions on running the weekly update and deploying to production, please refer to the **[Update Guide (update.md)](./update.md)**.

## Technical Overview

- **Framework:** Next.js (React)
- **Styling:** Vanilla CSS / Tailwind CSS
- **Deployment:** Containerized (Docker) on Google Cloud Platform (GCP)
- **Data Source:** Gmail API (for weekly updates), Google Photos API (for media), and local Markdown content

---

## Deployment to Google Cloud Platform (GCP)

Since `deploy.ps1` is ignored by source control, this section provides instructions for deploying to **Google Cloud Run** across all platforms (Windows, Linux, and macOS).

### 1. Prerequisites
- **Node.js 20+**: Install from [nodejs.org](https://nodejs.org/).
- **Google Cloud SDK**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install).
- **Docker** (Optional): Useful for testing the containerized build locally.

### 2. Environment Setup
1.  **Install dependencies:**
    ```bash
    cd lricbc-web
    npm install
    ```
2.  **Authenticate with Google Cloud:**
    ```bash
    gcloud auth login
    gcloud config set project lricbc-web
    ```
3.  **Prepare Required (Ignored) Files:**
    The following files are necessary for development and deployment but are ignored by git for security:
    -   `.env`: Create this file in `lricbc-web/` and add `ADMIN_POST_KEY=your_secure_key`.
    -   `credentials.json`: Obtain your Google OAuth 2.0 Desktop credentials from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
    -   `token.json`: Automatically generated after your first successful `npm run fetch-updates`.

### 3. Deploy to Cloud Run
Run the following commands from the `lricbc-web` directory.

**For Linux / macOS (Bash/Zsh):**
```bash
# 1. Create the storage bucket (if not already created)
gcloud storage buckets create gs://lricbc-web-storage --project lricbc-web --location us-central1

# 2. Deploy the service
gcloud run deploy lricbc-web \
    --source . \
    --project lricbc-web \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars "ADMIN_POST_KEY=your_secure_key,DATA_STORAGE_PATH=/app/storage" \
    --add-volume "name=storage,type=cloud-storage,bucket=lricbc-web-storage" \
    --add-volume-mount "volume=storage,mount-path=/app/storage"
```

**For Windows (PowerShell):**
```powershell
# 1. Create the storage bucket (if not already created)
gcloud storage buckets create gs://lricbc-web-storage --project lricbc-web --location us-central1

# 2. Deploy the service
gcloud run deploy lricbc-web `
    --source . `
    --project lricbc-web `
    --region us-central1 `
    --allow-unauthenticated `
    --set-env-vars "ADMIN_POST_KEY=your_secure_key,DATA_STORAGE_PATH=/app/storage" `
    --add-volume "name=storage,type=cloud-storage,bucket=lricbc-web-storage" `
    --add-volume-mount "volume=storage,mount-path=/app/storage"
```

### 4. Data Sync
To populate the storage bucket with initial local content:

**Linux / macOS:**
```bash
gcloud storage cp -r content/updates gs://lricbc-web-storage/content/
gcloud storage cp -r public/announcements gs://lricbc-web-storage/public/
gcloud storage cp -r public/gallery gs://lricbc-web-storage/public/
```

**Windows (PowerShell):**
```powershell
gcloud storage cp -r content/updates gs://lricbc-web-storage/content/
gcloud storage cp -r public/announcements gs://lricbc-web-storage/public/
gcloud storage cp -r public/gallery gs://lricbc-web-storage/public/
```

---
*For automated weekly content updates, please see [update.md](./update.md).*
