# AI Job Board — Features (AI-generated)

This document describes the features implemented in the job board and how they are intended to be used.

1. Job listing
  - The homepage lists jobs fetched from GitHub Issues (issues labelled `job`) at build time when configured with `GITHUB_REPO` and `GITHUB_TOKEN`.
  - When GitHub is not configured, a bundled sample dataset is used.
  - Client-side search and filters allow users to query jobs by title, company, location and type.

2. Post a Job
  - The `Post a Job` page shows a form for creating new job posts.
  - If `GITHUB_REPO` and `GITHUB_TOKEN` are set in environment variables, submitting the form creates a new GitHub Issue in the configured repo with label `job`. The issue body contains structured fields (Company, Location, Type, Apply URL) to make it easy to parse for consumers.
  - If GitHub is not configured the endpoint returns a demo-mode response so the UX can be validated locally.

3. CI / CD
  - A GitHub Actions workflow (`.github/workflows/ci.yml`) installs dependencies and builds the Next.js app on push and pull requests.
  - The workflow also includes an optional `deploy-to-vercel` job that uses the `amondnet/vercel-action` action to trigger a Vercel deployment. To enable it, add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as repository secrets.

4. Extensibility
  - Jobs are consumed from GitHub Issues, which provides a simple persistence layer without adding a DB.
  - The API route can be extended to validate input, add authentication (e.g., GitHub App or OAuth), or to store data in a database.

5. Security & Secrets
  - Secrets (GitHub token, Vercel token) must be configured in the hosting environment (Vercel) and in GitHub Actions secrets to enable full functionality.

Usage Examples
- Local: run `npm run dev` and open `http://localhost:3000`.
- Posting (production): set `GITHUB_REPO=owner/repo` and `GITHUB_TOKEN` in Vercel environment variables.
