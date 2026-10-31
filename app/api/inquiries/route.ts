import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const body = await request.json()
  const { listingId, message } = body

  if (!Number.isInteger(listingId) || !message?.trim()) {
    return NextResponse.json({ error: 'Invalid inquiry data.' }, { status: 400 })
  }

  await query(
    `INSERT INTO inquiries (listing_id, renter_id, renter_name, renter_email, message)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      listingId,
      session.user.id,
      session.user.name,
      session.user.email,
      message.trim(),
    ],
  )

  return NextResponse.json({ success: true }, { status: 201 })
}