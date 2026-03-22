#!/bin/bash

# Content synchronization script for LRICBC Web to Google Cloud Storage
PROJECT_ID="lricbc-web"

echo -e "\033[0;36mStarting content sync for project: $PROJECT_ID\033[0m"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "\033[0;31merror: gcloud command not found. Please install Google Cloud SDK.\033[0m"
    exit 1
fi

# Sync dynamic content directories
echo -e "\033[0;33mSyncing content, fetch data, and public assets to Cloud Storage bucket...\033[0m"

# Sync Markdown content
echo -e "\033[0;90mSyncing Markdown content...\033[0m"
gcloud storage rsync ./content gs://lricbc-web-storage/content --recursive --project $PROJECT_ID

# Sync fetched raw data
echo -e "\033[0;90mSyncing raw fetched data...\033[0m"
gcloud storage rsync ./fetch_raw gs://lricbc-web-storage/fetch_raw --recursive --project $PROJECT_ID

# Sync public assets (announcements, gallery, etc.)
echo -e "\033[0;90mSyncing public assets...\033[0m"
# Note: We sync announcements and gallery. We skip the root files as they are usually part of the build.
gcloud storage rsync ./public/announcements gs://lricbc-web-storage/public/announcements --recursive --project $PROJECT_ID
gcloud storage rsync ./public/gallery gs://lricbc-web-storage/public/gallery --recursive --project $PROJECT_ID --exclude "metadata.sample.json"
gcloud storage rsync ./public/logo gs://lricbc-web-storage/public/logo --recursive --project $PROJECT_ID

echo -e "\033[0;32mContent sync successful!\033[0m"
