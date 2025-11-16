import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { useState } from 'react'
import * as Sentry from '@sentry/react'
import { Turnstile } from 'src/components/Turnstile'

export const Route = createFileRoute('/boards/$boardId')({
  component: BoardPage,
})

function BoardPage() {
  const { boardId } = Route.useParams()
  const bid = boardId as Id<'boards'>

  const notes = useQuery(api.notes.listNotes, { boardId: bid })
  const createNote = useMutation(api.notes.createNote)
  const scrapeAndCreate = useAction(api.firecrawl.scrapeAndCreateNote)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  async function onAdd() {
    if (!title.trim()) return
    await createNote({ boardId: bid, title, content })
    setTitle('')
    setContent('')
  }

  async function onCapture() {
    if (!url.trim()) return
    if (!turnstileToken) {
      alert('Please complete the Turnstile check before capturing.')
      return
    }

    await scrapeAndCreate({ boardId: bid, url, turnstileToken })
    setUrl('')
    setTurnstileToken(null)
  }

  function triggerTestError() {
    try {
      throw new Error('Sentry test error from BoardPage')
    } catch (e) {
      Sentry.captureException(e)
      alert('Sent a test error to Sentry')
    }
  }

  if (notes === undefined) return <div className="p-4">Loading…</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Board: {boardId}</h1>

      {/* Sentry test button */}
      <button
        className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
        onClick={triggerTestError}
      >
        Send Sentry test error
      </button>

      {/* Capture from URL via Firecrawl + Turnstile */}
      <div className="max-w-xl space-y-2">
        <input
          className="w-full rounded border border-slate-600 bg-slate-800 p-2"
          placeholder="Paste a URL to capture as a note"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />

        <Turnstile onVerify={token => setTurnstileToken(token)} />

        <button
          className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={onCapture}
        >
          Capture → Note
        </button>
      </div>

      {/* Manual add note */}
      <div className="max-w-xl space-y-2">
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

      {/* Notes list */}
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
  )
}