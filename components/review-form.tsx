'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'

export function ReviewForm({ listingId }: { listingId: number }) {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('saving')
    setError('')

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, rating, title, body }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Could not submit your review.')
      setStatus('error')
      return
    }

    setStatus('done')
    setTitle('')
    setBody('')
    setRating(5)
    router.refresh()
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-800">Thank you for your review.</p>
        <p className="mt-1 text-sm text-emerald-700">
          It has been sent for moderation and will appear once approved.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-5">
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-semibold">Rating</label>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                className="rounded p-1"
              >
                <Star
                  size={22}
                  fill={n <= rating ? '#c27e45' : 'none'}
                  className={n <= rating ? 'text-[#c27e45]' : 'text-muted-foreground'}
                />
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Honest landlord, water always available"
            className="rounded-lg border px-3 py-2 font-normal outline-none focus:border-primary"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Your experience
          <textarea
            required
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share what future tenants should know..."
            className="rounded-lg border px-3 py-2 font-normal outline-none focus:border-primary"
          />
        </label>

        {error && (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          disabled={status === 'saving'}
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {status === 'saving' ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  )
}