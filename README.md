# StartFlow Capture Boards

Capture any URL into structured notes using Firecrawl, Convex, and TanStack Start.  
Each board is a workspace of notes that can be added manually or scraped from the web, with Turnstile protection and Sentry monitoring.

## Features

- Board-based note organization (Convex as the backend)
- "Capture → Note" from any URL via Firecrawl
- Cloudflare Turnstile bot protection
- Edit & delete notes inline
- Summary, keywords, and original URL stored per note
- Error tracking via Sentry
- Built with TanStack Start, React, and Tailwind styles

## Tech Stack

- Frontend: TanStack Start (Vite), React, TypeScript, Tailwind-style classes
- Backend: Convex functions & actions
- Integrations: Firecrawl, Cloudflare Turnstile, Sentry

## Getting Started

```bash
git clone https://github.com/aseansingh/startflow.git
cd startflow
npm install
