import { headers } from 'next/headers'
import { Building2, CheckCircle2, Clock, Flag, Star, Users } from 'lucide-react'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import { ApprovalButtons } from '@/components/approval-buttons'
import { ReviewApprovalButtons } from '@/components/review-approval-buttons'

type Listing = {
  id: number
  property_name: string
  location: string
  units: string
  monthly_rent: string
  description: string
  landlord_name: string
  email: string
  status: string
  created_at: string
}

type PendingReview = {
  id: number
  property_name: string
  author_name: string
  rating: number
  title: string
  body: string
  created_at: string
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-muted-foreground">Please sign in to continue.</p>
      </main>
    )
  }

  const role = (session.user as { role?: string }).role
  if (role !== 'admin') {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">Not authorised</h1>
        <p className="mt-2 text-muted-foreground">
          This area is for platform administrators.
        </p>
      </main>
    )
  }

  const pendingListings = await query<Listing>(
    `SELECT id, property_name, location, units, monthly_rent, description,
            landlord_name, email, status, created_at
       FROM property_listings
      WHERE status = 'pending'
      ORDER BY created_at DESC`,
  )

  const pendingReviews = await query<PendingReview>(
    `SELECT r.id, r.author_name, r.rating, r.title, r.body, r.created_at,
            p.property_name
       FROM reviews r
       JOIN property_listings p ON p.id = r.listing_id
      WHERE r.status = 'pending'
      ORDER BY r.created_at DESC`,
  )

  const [counts] = await query<{
    totalListings: number
    approvedListings: number
    totalUsers: number
  }>(
    `SELECT
       (SELECT COUNT(*)::int FROM property_listings) AS "totalListings",
       (SELECT COUNT(*)::int FROM property_listings WHERE status = 'approved') AS "approvedListings",
       (SELECT COUNT(*)::int FROM "user") AS "totalUsers"`,
  )

  return (
    <main className="p-5 md:p-10">
      <p className="text-sm text-muted-foreground">Platform administration</p>
      <h1 className="mt-1 text-3xl font-bold">Admin panel</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Moderate listings, approve reviews, and monitor platform activity.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Flag}
          label="Pending listings"
          value={pendingListings.length}
          accent={pendingListings.length > 0}
        />
        <StatCard
          icon={Star}
          label="Pending reviews"
          value={pendingReviews.length}
          accent={pendingReviews.length > 0}
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved listings"
          value={counts.approvedListings}
        />
        <StatCard icon={Users} label="Registered users" value={counts.totalUsers} />
      </div>

      {/* Listings section */}
      <section id="listings" className="mt-10 rounded-2xl border bg-card">
        <div className="flex items-center gap-2 border-b p-5">
          <Building2 className="size-4 text-muted-foreground" />
          <h2 className="font-semibold">Listings awaiting approval</h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {pendingListings.length} pending
          </span>
        </div>

        {pendingListings.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Nothing to review right now.
          </div>
        ) : (
          <div className="divide-y">
            {pendingListings.map((listing) => (
              <article key={listing.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-2xl">
                    <p className="font-semibold">{listing.property_name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {listing.location} · {listing.units} · {listing.monthly_rent}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{listing.description}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      By {listing.landlord_name} ({listing.email})
                    </p>
                  </div>
                  <ApprovalButtons listingId={listing.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Reviews section */}
      <section id="reviews" className="mt-8 rounded-2xl border bg-card">
        <div className="flex items-center gap-2 border-b p-5">
          <Clock className="size-4 text-muted-foreground" />
          <h2 className="font-semibold">Reviews awaiting approval</h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {pendingReviews.length} pending
          </span>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Nothing to review right now.
          </div>
        ) : (
          <div className="divide-y">
            {pendingReviews.map((review) => (
              <article key={review.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{review.property_name}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                        <Star size={13} fill="currentColor" />
                        {review.rating}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold">{review.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      By {review.author_name} ·{' '}
                      {new Date(review.created_at).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <ReviewApprovalButtons reviewId={review.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: typeof Flag
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-5 ${
        accent ? 'border-amber-300' : ''
      }`}
    >
      <Icon className={`size-5 ${accent ? 'text-amber-600' : 'text-primary'}`} />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}