import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Building2, CheckCircle2, Clock } from 'lucide-react'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'

export default async function LandlordAnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in?callbackUrl=/landlord/analytics')

  const [totals] = await query<{
    total: number
    approved: number
    pending: number
  }>(
    `SELECT
       (SELECT COUNT(*)::int FROM property_listings WHERE owner_id = $1) AS total,
       (SELECT COUNT(*)::int FROM property_listings WHERE owner_id = $1 AND status = 'approved') AS approved,
       (SELECT COUNT(*)::int FROM property_listings WHERE owner_id = $1 AND status = 'pending') AS pending`,
    [session.user.id],
  )

  return (
    <main className="p-5 md:p-10">
      <p className="text-sm text-muted-foreground">Landlord workspace</p>
      <h1 className="mt-1 text-3xl font-bold">Analytics</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A summary of your listing performance.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Building2} label="Total listings" value={totals.total} />
        <StatCard icon={CheckCircle2} label="Approved" value={totals.approved} />
        <StatCard icon={Clock} label="Pending review" value={totals.pending} />
      </div>

      <div className="mt-8 rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
        Detailed view and inquiry metrics coming soon.
      </div>
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
  value: number
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <Icon className="size-5 text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}