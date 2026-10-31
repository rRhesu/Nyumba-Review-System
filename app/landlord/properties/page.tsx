import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'

type Listing = {
  id: number
  slug: string
  property_name: string
  location: string
  units: string
  monthly_rent: string
  status: string
  created_at: string
}

export default async function LandlordPropertiesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in?callbackUrl=/landlord/properties')

  const listings = await query<Listing>(
    `SELECT id, slug, property_name, location, units, monthly_rent, status, created_at
       FROM property_listings
      WHERE owner_id = $1
      ORDER BY created_at DESC`,
    [session.user.id],
  )

  return (
    <main className="p-5 md:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Landlord workspace</p>
          <h1 className="mt-1 text-3xl font-bold">My properties</h1>
        </div>
        <Link
          href="/list-your-property"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" />
          Add property
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed p-12 text-center">
          <p className="font-medium">You haven&apos;t listed any properties yet.</p>
          <Link
            href="/list-your-property"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" />
            Add your first property
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Units</th>
                <th className="px-5 py-3">Rent</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {listings.map((l) => (
                <tr key={l.id}>
                  <td className="px-5 py-4 font-medium">{l.property_name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{l.location}</td>
                  <td className="px-5 py-4 text-muted-foreground">{l.units}</td>
                  <td className="px-5 py-4 text-muted-foreground">{l.monthly_rent}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/apartments/${l.slug}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
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
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
        styles[status] || 'bg-muted text-muted-foreground'
      }`}
    >
      {status}
    </span>
  )
}