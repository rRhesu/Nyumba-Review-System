import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { auth } from '@/lib/auth'
import { query } from '@/lib/db'

type Inquiry = {
  id: number
  property_name: string
  renter_name: string
  renter_email: string
  message: string
  created_at: string
}

export default async function LandlordInquiriesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in?callbackUrl=/landlord/inquiries')

  // Fetch inquiries ONLY for properties owned by this landlord
  const inquiries = await query<Inquiry>(
    `SELECT i.id, i.renter_name, i.renter_email, i.message, i.created_at, p.property_name
       FROM inquiries i
       JOIN property_listings p ON p.id = i.listing_id
      WHERE p.owner_id = $1
      ORDER BY i.created_at DESC`,
    [session.user.id],
  )

  return (
    <main className="p-5 md:p-10">
      <p className="text-sm text-muted-foreground">Landlord workspace</p>
      <h1 className="mt-1 text-3xl font-bold">Inquiries</h1>

      {inquiries.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed p-12 text-center">
          <MessageSquare className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 font-medium">No inquiries yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages from interested tenants will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 divide-y rounded-2xl border bg-card">
          {inquiries.map((inq) => (
            <div key={inq.id} className="p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-primary">
                  Re: {inq.property_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(inq.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-3 text-sm">{inq.message}</p>
              <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                <p><strong>From:</strong> {inq.renter_name}</p>
                <p className="text-muted-foreground">{inq.renter_email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}