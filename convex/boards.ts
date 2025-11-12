import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createBoard = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return await ctx.db.insert("boards", {
      name,
      createdAt: Date.now(),
    });
  },
});