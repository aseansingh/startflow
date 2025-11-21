import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import * as Sentry from "@sentry/react";
import { Turnstile } from "../../components/Turnstile";

export const Route = createFileRoute("/boards/$boardId")({
  component: BoardPage,
});

function BoardPage() {
  const { boardId } = Route.useParams();
  const bid = boardId as Id<"boards">;

  const notes = useQuery(api.notes.listNotes, { boardId: bid }) ?? [];
  const createNote = useMutation(api.notes.createNote);
  const updateNote = useMutation(api.notes.updateNote);
  const deleteNote = useMutation(api.notes.deleteNote);
  const scrapeAndCreate = useAction(api.firecrawl.scrapeAndCreateNote);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  async function onAdd() {
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) return;

    await createNote({
      boardId: bid,
      url: "",
      title: t || "Untitled",
      content: c || "",
      summary: undefined,
      keywords: undefined,
      imageUrl: undefined,
    });

    setTitle("");
    setContent("");
  }

  async function onCapture() {
    if (!url.trim()) return;
    if (!turnstileToken) {
      alert("Please complete the Turnstile check before capturing.");
      return;
    }

    await scrapeAndCreate({
      boardId: bid,
      url,
      turnstileToken,
    });

    setUrl("");
    setTurnstileToken(null);
  }

  function triggerTestError() {
    try {
      throw new Error("Sentry test error from BoardPage");
    } catch (e) {
      Sentry.captureException(e);
      alert("Sent a test error to Sentry");
    }
  }

  function startEdit(noteId: string, current: string) {
    setEditingId(noteId);
    setEditingContent(current);
  }

  async function saveEdit(noteId: string) {
    await updateNote({ noteId, content: editingContent });
    setEditingId(null);
    setEditingContent("");
  }

  async function remove(noteId: string) {
    if (!confirm("Delete this note?")) return;
    await deleteNote({ noteId });
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Board: {boardId}</h1>

      <button
        className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
        onClick={triggerTestError}
      >
        Send Sentry test error
      </button>

      {/* Capture via URL + Turnstile */}
      <div className="max-w-xl space-y-2">
        <input
          className="w-full rounded border border-slate-600 bg-slate-800 p-2"
          placeholder="Paste a URL to capture as a note"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <Turnstile onVerify={(token) => setTurnstileToken(token)} />

        <button
          className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={onCapture}
        >
          Capture → Note
        </button>
      </div>

      {/* Manual note add */}
      <div className="max-w-xl space-y-2">
        <input
          className="w-full rounded border border-slate-600 bg-slate-800 p-2"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full rounded border border-slate-600 bg-slate-800 p-2"
          placeholder="Note content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={onAdd}
        >
          Add note
        </button>
      </div>

      {/* Notes list */}
      <div className="space-y-3">
        {notes.map((n) => (
          <div
            key={n._id}
            className="border border-slate-700 rounded-lg p-3 bg-slate-900/60"
          >
            <div className="flex justify-between items-center mb-2 gap-2">
              <div className="font-semibold">
                {n.title || "Untitled note"}
              </div>
              <div className="flex gap-2">
                <button
                  className="text-xs px-2 py-1 border rounded"
                  onClick={() => startEdit(n._id as string, n.content ?? "")}
                >
                  Edit
                </button>
                <button
                  className="text-xs px-2 py-1 border border-red-500 text-red-400 rounded"
                  onClick={() => remove(n._id as string)}
                >
                  Delete
                </button>
              </div>
            </div>

            {n.url && n.url !== "" && (
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 underline"
              >
                Open original link
              </a>
            )}

            {n.summary && (
              <p className="text-sm text-slate-200 mt-2">{n.summary}</p>
            )}

            {n.keywords?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {n.keywords.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-200"
                  >
                    {k}
                  </span>
                ))}
              </div>
            ) : null}

            {editingId === (n._id as string) ? (
              <div className="mt-3 space-y-2">
                <textarea
                  className="w-full rounded border border-slate-600 bg-slate-800 p-2"
                  rows={4}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button
                  className="px-3 py-1 text-xs rounded bg-emerald-600 text-white"
                  onClick={() => saveEdit(n._id as string)}
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap text-sm">
                {n.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}