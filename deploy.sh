#!/bin/bash

# Deployment script for LRICBC Web to Google Cloud Run

PROJECT_ID="lricbc-web"
REGION="us-central1"
SERVICE_NAME="lricbc-web"
ENV_FILE=".env"
DEFAULT_GCLOUD="$HOME/google-cloud-sdk/bin/gcloud"

set -o errexit
set -o pipefail

trim() {
    local var="$1"
    var="${var//$'\r'/}"
    var="${var#${var%%[![:space:]]*}}"
    var="${var%${var##*[![:space:]]}}"
    printf '%s' "$var"
}

echo -e "\033[0;36mStarting deployment for project: $PROJECT_ID\033[0m"

# Locate gcloud
GCLOUD_COMMAND="gcloud"
if ! command -v "$GCLOUD_COMMAND" &> /dev/null; then
    if [ -x "$DEFAULT_GCLOUD" ]; then
        GCLOUD_COMMAND="$DEFAULT_GCLOUD"
    else
        echo -e "\033[0;31merror: gcloud command not found. Please install Google Cloud SDK.\033[0m"
        exit 1
    fi
fi

# Load environment variables from .env with key=value parsing
if [ -f "$ENV_FILE" ]; then
    echo -e "\033[0;90mLoading environment variables from $ENV_FILE...\033[0m"
    while IFS= read -r raw_line || [ -n "$raw_line" ]; do
        line="${raw_line%%#*}"
        line="$(trim "$line")"
        if [ -z "$line" ]; then
            continue
        fi
        if [[ "$line" != *=* ]]; then
            continue
        fi

        key="$(trim "${line%%=*}")"
        value="$(trim "${line#*=}")"

        if [[ $value == \"*\" && $value == *\" ]]; then
            value="${value#\"}"
            value="${value%\"}"
        fi
        if [[ $value == \'*\' && $value == *\' ]]; then
            value="${value#\'}"
            value="${value%\'}"
        fi

        export "$key=$value"
    done < "$ENV_FILE"
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
# NOTE: Ensure the Google Cloud Storage bucket 'lricbc-web-storage' exists.
# You can create it with: gcloud storage buckets create gs://lricbc-web-storage --project $PROJECT_ID
"$GCLOUD_COMMAND" run deploy "$SERVICE_NAME" \
    --source . \
    --project "$PROJECT_ID" \
    --region "$REGION" \
    --port 3000 \
    --allow-unauthenticated \
    --platform managed \
    --set-env-vars "ADMIN_POST_KEY=$ADMIN_POST_KEY,DATA_STORAGE_PATH=/app/storage" \
    --add-volume "name=storage,type=cloud-storage,bucket=lricbc-web-storage" \
    --add-volume-mount "volume=storage,mount-path=/app/storage"

if [ $? -eq 0 ]; then
    echo -e "\033[0;32mDeployment successful! Running content sync...\033[0m"
    chmod +x ./sync-content.sh
    ./sync-content.sh
else
    echo -e "\033[0;31mDeployment failed.\033[0m"
    exit 1
fi
