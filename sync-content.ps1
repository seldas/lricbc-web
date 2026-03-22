# Content synchronization script for LRICBC Web to Google Cloud Storage

$PROJECT_ID = "lricbc-web"
$ENV_FILE = ".env"

Write-Host "Starting content sync for project: $PROJECT_ID" -ForegroundColor Cyan

# Check if gcloud is accessible in PATH or common install location
$GCLOUD = "gcloud"
if (!(Get-Command $GCLOUD -ErrorAction SilentlyContinue)) {
    $GCLOUD = "$env:USERPROFILE\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
    if (!(Test-Path $GCLOUD)) {
        Write-Host "error: gcloud command not found. Please install Google Cloud SDK." -ForegroundColor Red
        exit 1
    }
}

# Sync dynamic content directories
Write-Host "Syncing content, fetch data, and public assets to Cloud Storage bucket..." -ForegroundColor Yellow

# Sync Markdown content
Write-Host "Syncing Markdown content..." -ForegroundColor Gray
& $GCLOUD storage rsync ./content gs://lricbc-web-storage/content --recursive --project $PROJECT_ID

# Sync fetched raw data
Write-Host "Syncing raw fetched data..." -ForegroundColor Gray
& $GCLOUD storage rsync ./fetch_raw gs://lricbc-web-storage/fetch_raw --recursive --project $PROJECT_ID

# Sync public assets (announcements, gallery, etc.)
Write-Host "Syncing public assets..." -ForegroundColor Gray
# Note: We sync announcements and gallery. We skip the root files as they are usually part of the build.
& $GCLOUD storage rsync ./public/announcements gs://lricbc-web-storage/public/announcements --recursive --project $PROJECT_ID
& $GCLOUD storage rsync ./public/gallery gs://lricbc-web-storage/public/gallery --recursive --project $PROJECT_ID --exclude "metadata.sample.json"
& $GCLOUD storage rsync ./public/logo gs://lricbc-web-storage/public/logo --recursive --project $PROJECT_ID

Write-Host "Content sync successful!" -ForegroundColor Green
