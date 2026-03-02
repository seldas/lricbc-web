#!/bin/bash

# Deployment script for LRICBC Web to Google Cloud Run

PROJECT_ID="lricbc-web"
REGION="us-central1"
SERVICE_NAME="lricbc-web"
ENV_FILE=".env"

echo -e "\033[0;36mStarting deployment for project: $PROJECT_ID\033[0m"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "\033[0;31merror: gcloud command not found. Please install Google Cloud SDK.\033[0m"
    exit 1
fi

# Load environment variables from .env
if [ -f "$ENV_FILE" ]; then
    echo -e "\033[0;90mLoading environment variables from $ENV_FILE...\033[0m"
    export $(grep -v '^#' $ENV_FILE | xargs)
else
    echo -e "\033[0;31merror: $ENV_FILE file not found. Please create one with ADMIN_POST_KEY.\033[0m"
    exit 1
fi

if [ -z "$ADMIN_POST_KEY" ]; then
    echo -e "\033[0;31merror: ADMIN_POST_KEY not found in $ENV_FILE.\033[0m"
    exit 1
fi

# Build and deploy using Cloud Build
echo -e "\033[0;33mBuilding and deploying to Cloud Run...\033[0m"
gcloud run deploy $SERVICE_NAME 
    --source . 
    --project $PROJECT_ID 
    --region $REGION 
    --allow-unauthenticated 
    --platform managed 
    --set-env-vars "ADMIN_POST_KEY=$ADMIN_POST_KEY,DATA_STORAGE_PATH=/app/storage" 
    --add-volume "name=storage,type=cloud-storage,bucket=lricbc-web-storage" 
    --add-volume-mount "volume=storage,mount-path=/app/storage"

if [ $? -eq 0 ]; then
    echo -e "\033[0;33mSyncing content, fetch data, and public assets to Cloud Storage bucket...\033[0m"
    gcloud storage rsync ./content gs://lricbc-web-storage/content --recursive --project $PROJECT_ID
    gcloud storage rsync ./fetch_raw gs://lricbc-web-storage/fetch_raw --recursive --project $PROJECT_ID
    gcloud storage rsync ./public gs://lricbc-web-storage/public --recursive --project $PROJECT_ID
    echo -e "\033[0;32mDeployment and sync successful!\033[0m"
else
    echo -e "\033[0;31mDeployment failed.\033[0m"
    exit 1
fi
