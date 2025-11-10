import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const listNotes = query({
  args: { boardId: v.id('boards') },
  handler: async (ctx, { boardId }) => {
    return await ctx.db.query('notes').withIndex('by_board', q => q.eq('boardId', boardId)).order('desc').collect()
  },
})

export const createNote = mutation({
  args: {
    boardId: v.id('boards'),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { boardId, title, content }) => {
    const now = Date.now()
    return await ctx.db.insert('notes', {
      boardId,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateNote = mutation({
  args: { noteId: v.id('notes'), content: v.string() },
  handler: async (ctx, { noteId, content }) => {
    const note = await ctx.db.get(noteId)
    if (!note) throw new Error('Note not found')
    await ctx.db.patch(noteId, { content, updatedAt: Date.now() })
  },
})