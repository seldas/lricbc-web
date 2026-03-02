# Deployment script for LRICBC Web to Google Cloud Run

$PROJECT_ID = "lricbc-web"
$REGION = "us-central1"
$SERVICE_NAME = "lricbc-web"
$GCLOUD_PATH = "$env:USERPROFILE\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
$ENV_FILE = ".env"

Write-Host "Starting deployment for project: $PROJECT_ID" -ForegroundColor Cyan

# Check if gcloud is accessible
if (!(Test-Path $GCLOUD_PATH)) {
    Write-Error "gcloud not found at $GCLOUD_PATH. Please ensure Google Cloud SDK is installed."
    exit
}

# Load environment variables from .env
if (Test-Path $ENV_FILE) {
    Write-Host "Loading environment variables from $ENV_FILE..." -ForegroundColor Gray
    Get-Content $ENV_FILE | ForEach-Object {
        if ($_ -match '^(?<key>[^#=]+)=(?<value>.*)$') {
            $key = $Matches.key.Trim()
            $value = $Matches.value.Trim()
            Set-Item -Path "Env:$key" -Value $value
        }
    }
} else {
    Write-Error ".env file not found. Please create one with ADMIN_POST_KEY."
    exit
}

$ADMIN_POST_KEY = $env:ADMIN_POST_KEY
if (-not $ADMIN_POST_KEY) {
    Write-Error "ADMIN_POST_KEY not found in $ENV_FILE."
    exit
}

# Build and deploy using Cloud Build
Write-Host "Building and deploying to Cloud Run..." -ForegroundColor Yellow
# NOTE: Ensure the Google Cloud Storage bucket 'lricbc-web-storage' exists.
# You can create it with: gcloud storage buckets create gs://lricbc-web-storage --project $PROJECT_ID
& $GCLOUD_PATH run deploy $SERVICE_NAME `
    --source . `
    --project $PROJECT_ID `
    --region $REGION `
    --allow-unauthenticated `
    --platform managed `
    --set-env-vars "ADMIN_POST_KEY=$ADMIN_POST_KEY,DATA_STORAGE_PATH=/app/storage" `
    --add-volume "name=storage,type=cloud-storage,bucket=lricbc-web-storage" `
    --add-volume-mount "volume=storage,mount-path=/app/storage"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Syncing content, fetch data, and public assets to Cloud Storage bucket..." -ForegroundColor Yellow
    & $GCLOUD_PATH storage rsync ./content gs://lricbc-web-storage/content --recursive --project $PROJECT_ID
    & $GCLOUD_PATH storage rsync ./fetch_raw gs://lricbc-web-storage/fetch_raw --recursive --project $PROJECT_ID
    & $GCLOUD_PATH storage rsync ./public gs://lricbc-web-storage/public --recursive --project $PROJECT_ID
    Write-Host "Deployment and sync successful!" -ForegroundColor Green
} else {
    Write-Host "Deployment failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
