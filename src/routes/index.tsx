import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const boards = useQuery(api.boards.listBoards) ?? [];
  const createBoard = useMutation(api.boards.createBoard);
  const [title, setTitle] = useState("");

  async function onCreate() {
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = await createBoard({ title: trimmed });
    setTitle("");
    window.location.href = `/boards/${id}`;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Boards</h1>

      <div className="flex gap-2 max-w-md">
        <input
          className="flex-1 rounded border border-slate-600 bg-slate-800 p-2"
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white"
          onClick={onCreate}
        >
          Create board
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {boards.length === 0 ? (
          <li className="text-gray-400">
            No boards yet. Create your first one!
          </li>
        ) : (
          boards.map((b) => (
            <li key={b._id}>
              <a
                href={`/boards/${b._id}`}
                className="text-indigo-400 hover:underline"
              >
                {b.title ?? "Untitled board"}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}