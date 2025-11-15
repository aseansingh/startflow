import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const scrapeAndCreateNote = action({
  args: {
    boardId: v.id("boards"),
    url: v.string(),
  },
  handler: async (ctx, { boardId, url }) => {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({ url, formats: ["markdown"] }),
    });

    if (!res.ok) throw new Error("Firecrawl failed");
    const data = await res.json();
    const markdown: string = data.markdown ?? "No content";

    await ctx.runMutation(api.notes.createNote, {
      boardId,
      title: `Captured: ${url}`,
      content: markdown,
    });
  },
});