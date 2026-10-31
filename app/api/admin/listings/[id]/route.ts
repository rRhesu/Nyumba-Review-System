import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const role = (session.user as { role?: string }).role
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 })
  }

  const { id } = await params
  const listingId = Number(id)
  if (!Number.isInteger(listingId)) {
    return NextResponse.json({ error: 'Invalid listing id.' }, { status: 400 })
  }

  const body = await request.json()
  const status = body?.status
  if (status !== 'approved' && status !== 'rejected') {
    return NextResponse.json(
      { error: 'Status must be "approved" or "rejected".' },
      { status: 400 },
    )
  }

  const rows = await query(
    `UPDATE property_listings
        SET status = $1
      WHERE id = $2
      RETURNING id, property_name, status`,
    [status, listingId],
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Listing not found.' }, { status: 404 })
  }

  return NextResponse.json(rows[0])
}