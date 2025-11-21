import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'

export const Route = createFileRoute('/new-board')({
  component: CreateBoard,
})

function CreateBoard() {
  const createBoard = useMutation(api.boards.createBoard)
  const navigate = useNavigate()
  const [name, setName] = useState('')

  async function onCreate() {
    const id = await createBoard({ title: name })
    navigate({ to: `/boards/${id}` })
  }

  return (
    <div className="p-6 space-y-3">
      <input
        className="border p-2 rounded w-full"
        placeholder="Board title"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={onCreate}
        className="px-3 py-2 bg-green-600 text-white rounded"
      >
        Create Board
      </button>
    </div>
  )
}