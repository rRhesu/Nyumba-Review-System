import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowUpRight, Building2, Eye, MessageSquare, Plus } from 'lucide-react'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'

type Listing = {
  id: number
  property_name: string
  location: string
  description: string
  units: string
  monthly_rent: string
  amenities: string | null
  status: string
  created_at: string
}

export default async function LandlordPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  // 1. Check if logged in
  if (!session?.user) redirect('/sign-in?callbackUrl=/landlord')

  // 2. Check if they actually have the right role
  const role = (session.user as { role?: string }).role
  if (role !== 'landlord_owner' && role !== 'admin') {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">Not authorised</h1>
        <p className="mt-2 text-muted-foreground">
          This area is for landlords. If you want to list a property, please submit one first.
        </p>
        <Link 
          href="/list-your-property" 
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Submit a property
        </Link>
      </main>
    )
  }

  // 3. If they are a landlord, fetch their data
  const listings = await query<Listing>(
    `SELECT id, property_name, location, description, units, monthly_rent,
            amenities, status, created_at
       FROM property_listings
      WHERE owner_id = $1
      ORDER BY created_at DESC`,
    [session.user.id],
  )

  const totals = {
    listings: listings.length,
    pending: listings.filter((l) => l.status === 'pending').length,
    approved: listings.filter((l) => l.status === 'approved').length,
  }

  return (
    <main className="p-5 md:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Landlord workspace</p>
          <h1 className="mt-1 text-3xl font-bold">
            Good to see you, {session.user.name?.split(' ')[0] || 'landlord'}.
          </h1>
        </div>
        <Link
          href="/list-your-property"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" />
          Add property
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Building2} label="Your listings" value={totals.listings} />
        <StatCard icon={MessageSquare} label="Pending review" value={totals.pending} />
        <StatCard icon={Eye} label="Approved" value={totals.approved} />
        <StatCard icon={ArrowUpRight} label="Total views" value="—" />
      </div>

      <section className="mt-8 rounded-2xl border bg-card">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-semibold">Your properties</h2>
          <Link href="/apartments" className="text-sm font-medium text-primary">
            View marketplace
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              You haven&apos;t listed any properties yet.
            </p>
            <Link
              href="/list-your-property"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="size-4" />
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{listing.property_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {listing.location} · {listing.units}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary">
                    {listing.monthly_rent}
                  </span>
                  <StatusBadge status={listing.status} />
                </div>
              </div>
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
}: {
  icon: typeof Building2
  label: string
  value: number | string
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <Icon className="size-5 text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800',
  }
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}