import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    createdAt: v.float64(),
    name: v.string(),
  }),

  notes: defineTable({
    boardId: v.id("boards"),
    title: v.string(),
    content: v.string(),
    createdAt: v.float64(),
    updatedAt: v.optional(v.float64()),
  })
    .index("by_board", ["boardId"]),
});