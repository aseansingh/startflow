import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  boards: defineTable({
    title: v.string(),
    createdAt: v.number(),
  }).index('by_title', ['title']),

  notes: defineTable({
    boardId: v.id('boards'),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_board', ['boardId']),
})