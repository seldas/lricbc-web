# Gemini Workspace Mandates: LRICBC Web

This document outlines the foundational mandates, architectural patterns, and engineering standards for the LRICBC (Little Rock Immanuel Chinese Baptist Church) website project. All AI interactions within this workspace must adhere to these instructions.

## 1. Environment & Shell
- **Operating System:** Windows 11.
- **Primary Shell:** PowerShell (pwsh). Use PowerShell syntax for all command execution (e.g., `$env:VARIABLE`, `Remove-Item`, `New-Item`).
- **Pathing:** Always use Windows-style backslashes (`\`) for file paths in commands, though Next.js/React imports should remain standard forward slashes (`/`).

## 2. Project Overview
- **Project Name:** LRICBC (Little Rock International Chinese Baptist Church).
- **Goal:** A bilingual (English/Simplified Chinese) church website for announcements, worship programs, testimonies, and event management.
- **Tech Stack:**
  - **Framework:** Next.js 16+ (App Router).
  - **UI/Styling:** Tailwind CSS 4, Radix UI, Shadcn/UI components.
  - **Icons:** Lucide React.
  - **Localization:** `i18next` / `react-i18next` for English and Simplified Chinese.
  - **Content:** Markdown-based content management (`content/` directory) using `gray-matter` and `remark`.
  - **Backend/Scripts:** TypeScript scripts run via `tsx` (e.g., `fetch-emails.ts`, `process-emails.ts`).

## 3. Engineering Standards
- **Bilingual Support:** 
  - All new UI strings MUST be added to the appropriate localization files in `lricbc-web/src/locales/`.
  - Ensure Chinese characters are correctly handled and files are saved with **UTF-8** encoding.
- **Content Conventions:**
  - Content files in `lricbc-web/content/` follow the `YYYY-MM-DD-slug.md` naming convention.
  - Use `gray-matter` for YAML frontmatter in Markdown files.
- **Surgical Updates:**
  - When modifying components, preserve the existing aesthetic (Vanilla CSS and Tailwind combination).
  - Adhere to the established `src/components/` and `src/app/` structure.
- **PowerShell Scripts:**
  - Maintain parity between `.sh` and `.ps1` scripts for deployment and content syncing.
  - When updating logic in one, ensure the other is updated to match.

## 4. Workflows
- **Email Processing:** The church updates content via emails. The `scripts/fetch-emails.ts` and `scripts/process-emails.ts` are critical for content ingestion. Use `npm run fetch-updates` and `npm run process-updates`.
- **Validation:** 
  - Use `npm run build` to verify types and build stability.
  - Use `npm run lint` for code quality checks.
- **Deployment:** Use `deploy.ps1` for local-to-production deployment orchestration.

## 5. Security & Privacy
- **Credentials:** Never commit `token.json`, `credentials.json`, or `.env` files.
- **Contact Messages:** The `contact-messages/` directory contains user data; handle with care and do not log contents.
