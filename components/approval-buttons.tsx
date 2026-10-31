'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'

export function ApprovalButtons({ listingId }: { listingId: number }) {
  const router = useRouter()
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null)

  async function update(status: 'approved' | 'rejected') {
    setBusy(status === 'approved' ? 'approve' : 'reject')

    const res = await fetch(`/api/admin/listings/${listingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    setBusy(null)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'Could not update the listing.')
      return
    }

    router.refresh()
  }

  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={() => update('approved')}
        disabled={busy !== null}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {busy === 'approve' ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Check className="size-4" />
        )}
        Approve
      </button>
      <button
        onClick={() => update('rejected')}
        disabled={busy !== null}
        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 px-3.5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
      >
        {busy === 'reject' ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <X className="size-4" />
        )}
        Reject
      </button>
    </div>
  )
}