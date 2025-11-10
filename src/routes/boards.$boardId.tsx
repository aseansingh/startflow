import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/boards/$boardId')({
  component: BoardPage,
})

function BoardPage() {
  const { boardId } = Route.useParams()
  const notes = useQuery(api.notes.listNotes, { boardId: boardId as any })
  const createNote = useMutation(api.notes.createNote)
  const updateNote = useMutation(api.notes.updateNote)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const sorted = useMemo(
    () => (notes ?? []).slice().sort((a, b) => b.createdAt - a.createdAt),
    [notes]
  )

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Board {boardId}</h1>
        <Link to="/" className="text-cyan-400 hover:underline">← Home</Link>
      </div>

      <form
        className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!title.trim()) return
          await createNote({ boardId: boardId as any, title, content })
          setTitle(''); setContent('')
        }}
      >
        <input
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
          placeholder="Note title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full h-28 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
          placeholder="Note content…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded"
          type="submit"
        >
          Add Note
        </button>
      </form>

      <ul className="space-y-4">
        {sorted?.map((n) => (
          <li key={n._id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="text-white font-semibold mb-2">{n.title}</div>
            <Editable
              initial={n.content}
              onSave={async (value) => updateNote({ noteId: n._id, content: value })}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Editable({
  initial,
  onSave,
}: {
  initial: string
  onSave: (v: string) => Promise<void>
}) {
  const [value, setValue] = useState(initial)
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-2">
      <textarea
        className="w-full h-32 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={saving}
        onClick={async () => {
          setSaving(true)
          try { await onSave(value) } finally { setSaving(false) }
        }}
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  )
}