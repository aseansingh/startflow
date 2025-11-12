import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

export const Route = createFileRoute("/boards/$boardId")({
  component: BoardPage,
});

function BoardPage() {
  const { boardId } = Route.useParams();
  const typedId = boardId as Id<"boards">;

  const notes = useQuery(api.notes.listNotes, { boardId: typedId });
  const createNote = useMutation(api.notes.createNote);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function onAdd() {
    if (!title.trim()) return;
    await createNote({ boardId: typedId, title, content });
    setTitle("");
    setContent("");
  }

  if (notes === undefined) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Board: {boardId}</h1>

      <div className="max-w-md space-y-2">
        <input
          className="w-full rounded border border-slate-600 bg-slate-800 p-2"
          placeholder="Note title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="w-full rounded border border-slate-600 bg-slate-800 p-2"
          placeholder="Note content"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white"
          onClick={onAdd}
        >
          Add note
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map(n => (
            <li key={n._id} className="border border-slate-700 rounded p-3">
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {n.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}