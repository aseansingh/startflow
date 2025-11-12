import { ConvexReactClient } from 'convex/react'

const url = import.meta.env.VITE_CONVEX_URL as string
if (!url) {
  console.warn('VITE_CONVEX_URL is not set. Run `npx convex dev` and copy the URL into .env.local.')
}

export const convex = new ConvexReactClient(url, { unsavedChangesWarning: false })