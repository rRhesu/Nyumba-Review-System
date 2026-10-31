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
  const { listingId, rating, title, body: text } = body ?? {}

  if (!Number.isInteger(listingId)) {
    return NextResponse.json({ error: 'Invalid listing.' }, { status: 400 })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1–5.' }, { status: 400 })
  }
  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
  }
  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Review body is required.' }, { status: 400 })
  }

  const rows = await query(
    `INSERT INTO reviews
       (listing_id, user_id, author_name, rating, title, body)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, rating, title, status, created_at`,
    [
      listingId,
      session.user.id,
      session.user.name || 'Anonymous',
      rating,
      title.trim(),
      text.trim(),
    ],
  )

  return NextResponse.json(rows[0], { status: 201 })
}