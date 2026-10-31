import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'

async function requireSession() {
  return auth.api.getSession({ headers: await headers() })
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function GET() {
  const session = await requireSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const listings = await query(
    `SELECT id, property_name, slug, location, description, units,
            monthly_rent, amenities, status, created_at
       FROM property_listings
      WHERE owner_id = $1
      ORDER BY created_at DESC`,
    [session.user.id],
  )

  return NextResponse.json(listings)
}

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const body = await request.json()

  const required = [
    'landlordName',
    'email',
    'propertyName',
    'location',
    'description',
    'units',
    'monthlyRent',
  ]

  if (required.some((field) => typeof body[field] !== 'string' || !body[field].trim())) {
    return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 })
  }

  const baseSlug = slugify(body.propertyName.trim())

  const rows = await query(
    `INSERT INTO property_listings
       (owner_id, landlord_name, email, company_name, property_name,
        slug, location, description, units, monthly_rent, amenities)
     VALUES ($1,$2,$3,$4,$5,
             $6 || '-' || nextval('property_listings_id_seq'),
             $7,$8,$9,$10,$11)
     RETURNING id, property_name, slug, location, status, created_at`,
    [
      session.user.id,
      body.landlordName.trim(),
      body.email.trim(),
      body.companyName?.trim() || null,
      body.propertyName.trim(),
      baseSlug,
      body.location.trim(),
      body.description.trim(),
      body.units.trim(),
      body.monthlyRent.trim(),
      body.amenities?.trim() || null,
    ],
  )

  // If the insert was successful, upgrade the user's role to landlord (if they are currently a renter)
  await query(
    `UPDATE "user" SET role = 'landlord_owner' WHERE id = $1 AND role = 'renter'`,
    [session.user.id]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
