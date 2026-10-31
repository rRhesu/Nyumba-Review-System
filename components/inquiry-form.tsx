'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { MessageCircle } from 'lucide-react'

export function InquiryForm({ listingId }: { listingId: number }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  if (isPending) return <div className="h-12 animate-pulse bg-muted rounded-lg" />

  if (!session?.user) {
    return (
      <button
        onClick={() => router.push(`/sign-in?callbackUrl=/apartments/${window.location.pathname.split('/').pop()}`)}
        className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Sign in to send an inquiry
      </button>
    )
  }

  if (status === 'done') {
    return (
      <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-center border border-emerald-200">
        <p className="text-sm font-semibold text-emerald-800">Message sent!</p>
        <p className="mt-1 text-xs text-emerald-600">The landlord will get back to you soon.</p>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, message }),
    })
    if (res.ok) setStatus('done')
    else setStatus('error')
  }

  return (
    <form onSubmit={submit} className="mt-5">
      <textarea
        required
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Hi, I'm interested in this property. Is it still available?"
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <button
        disabled={status === 'saving'}
        className="mt-2 w-full flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        <MessageCircle className="size-4" />
        {status === 'saving' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}