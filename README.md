# AI Job Board (Assessment)

This repository contains a lightweight Next.js job board intended for an assessment. It includes:

- A simple job listing UI with client-side search and filters.
- A "Post a Job" form that can create GitHub Issues (labelled `job`) when `GITHUB_REPO` and `GITHUB_TOKEN` are configured.
- A GitHub Actions workflow that builds the site and can deploy to Vercel when Vercel secrets are set.

Setup
1. Install deps: `npm ci`
2. Local dev: `npm run dev`

Publishing & Deploy
1. Create a GitHub repository and push this code.
2. (Optional) Connect the repository to Vercel for automatic deploys, or set Vercel secrets and let the workflow deploy.

Environment variables (for full features):
- `GITHUB_TOKEN` — a token with `repo` permissions to open issues.
- `GITHUB_REPO` — owner/repo (e.g. `your-org/ai-job-board`).
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — for the GitHub Action deploy step.

Notes
- If `GITHUB_REPO` and `GITHUB_TOKEN` are not set, the app falls back to sample jobs and posting operates in demo mode.
