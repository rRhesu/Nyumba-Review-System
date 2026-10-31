import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ShieldCheck, Star } from 'lucide-react'
import { query } from '@/lib/db'
import { ReviewForm } from '@/components/review-form'
import { InquiryForm } from '@/components/inquiry-form'

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

type Review = {
  id: number
  author_name: string
  rating: number
  title: string
  body: string
  created_at: string
}

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [listing] = await query<Listing>(
    `SELECT id, slug, property_name, location, description, units,
            monthly_rent, amenities, status, created_at
       FROM property_listings
      WHERE slug = $1 AND status = 'approved'
      LIMIT 1`,
    [slug],
  )

  if (!listing) notFound()

  const reviews = await query<Review>(
    `SELECT id, author_name, rating, title, body, created_at
       FROM reviews
      WHERE listing_id = $1 AND status = 'approved'
      ORDER BY created_at DESC`,
    [listing.id],
  )

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

  const amenities = listing.amenities
    ? listing.amenities.split(',').map((a) => a.trim()).filter(Boolean)
    : []

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/apartments" className="text-sm font-medium text-primary hover:underline">
        ← Back to marketplace
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border bg-card">
        <div className="h-72 w-full bg-gradient-to-br from-[#d7b37e] to-[#8a5f42] md:h-96" />

        <div className="grid gap-8 p-6 md:grid-cols-[1fr_280px] md:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {listing.location}
            </div>

            <h1 className="mt-3 text-4xl font-bold">{listing.property_name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              {avgRating !== null ? (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                  <Star size={14} fill="currentColor" />
                  {avgRating.toFixed(1)}
                  <span className="font-normal text-muted-foreground">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">No reviews yet</span>
              )}
              <span className="inline-flex items-center gap-1 text-sm text-primary">
                <ShieldCheck className="size-4" />
                Verified listing
              </span>
            </div>

            <p className="mt-6 leading-7 text-muted-foreground">{listing.description}</p>

            {amenities.length > 0 && (
              <>
                <h2 className="mt-8 text-xl font-semibold">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span key={amenity} className="rounded-full bg-muted px-3 py-1.5 text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="rounded-2xl bg-muted/50 p-5">
            <p className="text-sm text-muted-foreground">Monthly rent from</p>
            <p className="mt-1 text-2xl font-bold text-primary">{listing.monthly_rent}</p>
            <p className="mt-2 text-sm text-muted-foreground">{listing.units}</p>
            <InquiryForm listingId={listing.id} />
          </aside>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Resident reviews</h2>

        {reviews.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-1 text-sm font-bold text-primary">
                  <Star size={13} fill="currentColor" />
                  {review.rating}
                </div>
                <h3 className="mt-3 font-semibold">{review.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.body}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {review.author_name} ·{' '}
                  {new Date(review.created_at).toLocaleDateString('en-KE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Write a review</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reviews are moderated before they appear publicly.
          </p>
          <div className="mt-4">
            <ReviewForm listingId={listing.id} />
          </div>
        </div>
      </section>
    </main>
  )
}
