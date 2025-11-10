import { ConvexReactClient } from 'convex/react'

const url = import.meta.env.VITE_CONVEX_URL
if (!url) {
  console.warn('VITE_CONVEX_URL is not set. Did you run `npx convex dev`?')
}

export const convex = new ConvexReactClient(url!)