import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { AppSidebar } from '@/components/app-sidebar'

export default async function LandlordLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  
  // Allow access if they are a landlord OR an admin (so you can see their view)
  const hasAccess = (session?.user as { role?: string })?.role === 'landlord_owner' || 
                    (session?.user as { role?: string })?.role === 'admin'

  return (
    <div className={hasAccess ? "mx-auto grid max-w-7xl md:grid-cols-[220px_1fr]" : "mx-auto max-w-7xl"}>
      {hasAccess && <AppSidebar />}
      {children}
    </div>
  )
}