import Link from 'next/link'
import { Search } from 'lucide-react'
import { query } from '@/lib/db'

type Listing = {
  id: number
  slug: string
  property_name: string
  location: string
  description: string
  units: string
  monthly_rent: string
  amenities: string | null
  status: string
  created_at: string
}

export default async function ApartmentsPage() {
  const listings = await query<Listing>(
    `SELECT id, slug, property_name, location, description, units,
            monthly_rent, amenities, status, created_at
       FROM property_listings
      WHERE status = 'approved'
      ORDER BY created_at DESC`,
  )

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Explore Nairobi
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Find a home you&apos;ll feel good about.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Read honest reviews, compare amenities, and discover apartments that fit your lifestyle.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {listings.length} {listings.length === 1 ? 'home' : 'homes'} found
        </p>
        <Link
          href="/list-your-property"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          List your property
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed p-12 text-center">
          <Search className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 font-medium">No approved listings yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Once landlords submit their properties and admins approve them, they will appear here.
          </p>
          <Link
            href="/list-your-property"
            className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Be the first to list
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/apartments/${listing.slug}`}
              className="block overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[1.25] bg-gradient-to-br from-[#d7b37e] to-[#8a5f42]" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{listing.property_name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{listing.location}</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {listing.description}
                </p>
                <div className="mt-5">
                  <p className="text-xs text-muted-foreground">{listing.units}</p>
                  <p className="mt-1 text-base font-bold text-primary">
                    {listing.monthly_rent}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
