import { query } from '@/lib/db'
import HomePage, { type HomeListing } from '@/components/home-page'

export default async function Page() {
  const listings = await query<HomeListing>(
    `SELECT id, slug, property_name, location, description, units, monthly_rent
       FROM property_listings
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT 6`,
  )

  return <HomePage listings={listings} />
}