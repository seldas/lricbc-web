# LRICBC Web Application

This is the official web application for the **Little Rock Immanuel Chinese Baptist Church (LRICBC)**. The platform serves as a central hub for the congregation, providing access to bilingual worship programs, pastor's messages, and church updates.

Currently hosted at [lricbc-web-1005010236942.us-central1.run.app](https://lricbc-web-1005010236942.us-central1.run.app/)  
Will move to [lricbc.org](https://lricbc.org) when officially online

## Key Features

- **Automated Content Integration:** Synchronizes directly with church records (Gmail) to fetch and process weekly worship materials.
- **Bilingual Support:** Fully supports English and Chinese (Traditional) content for all worship programs and pastor's messages.
- **Responsive Design:** Optimized for both desktop and mobile viewing to ensure the congregation can access materials anywhere.
- **Media Sharing:** Integration with Google Photos to share church event photos and videos with the congregation.
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
*For development setup and deployment scripts, please see `package.json` and `deploy.ps1`.*
