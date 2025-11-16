import { action } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'

export const scrapeAndCreateNote = action({
  args: {
    boardId: v.id('boards'),
    url: v.string(),
    turnstileToken: v.string(),
  },
  handler: async (ctx, { boardId, url, turnstileToken }) => {
    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret) {
      throw new Error('TURNSTILE_SECRET_KEY not set')
    }

    // 1) Verify Turnstile
    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: new URLSearchParams({
          secret,
          response: turnstileToken,
        }),
      }
    )

    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      throw new Error('Turnstile verification failed')
    }

    // 2) Call your existing createNote mutation
    const content = `Captured from ${url} at ${new Date().toISOString()}`

    await ctx.runMutation(api.notes.createNote, {
      boardId,
      title: url,
      content,
    })
  },
})