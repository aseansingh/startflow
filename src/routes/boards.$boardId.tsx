import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import type { Id } from '../../convex/_generated/dataModel'
import { api } from '../../convex/_generated/api'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/boards/$boardId')({
  component: BoardPage,
})

function BoardPage() {
  const { boardId } = Route.useParams() as { boardId: Id<'boards'> }
  const notes = useQuery(api.notes.listNotes, { boardId })
  const createNote = useMutation(api.notes.createNote)
  const updateNote = useMutation(api.notes.updateNote)

  const [title, setTitle] = useState('Untitled')
  const [content, setContent] = useState('Hello from Convex + TanStack Start!')

  const sorted = useMemo(() => notes ?? [], [notes])

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Board {boardId}</h1>

      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
        <input
          className="w-full rounded p-2 bg-slate-900 border border-slate-700 text-white"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full rounded p-2 min-h-[120px] bg-slate-900 border border-slate-700 text-white"
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
          onClick={async () => {
            await createNote({ boardId, title, content })
            setTitle('Untitled')
            setContent('')
          }}
        >
          Add Note
        </button>
      </div>

      <ul className="space-y-3">
        {sorted.map((n) => (
          <li key={n._id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="text-white font-semibold">{n.title}</div>
            <textarea
              className="w-full mt-2 rounded p-2 min-h-[100px] bg-slate-900 border border-slate-700 text-white"
              defaultValue={n.content}
              onBlur={async (e) => {
                const val = e.currentTarget.value
                if (val !== n.content) {
                  await updateNote({ noteId: n._id, content: val })
                }
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}