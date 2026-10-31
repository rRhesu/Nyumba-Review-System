import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { AppSidebar } from '@/components/app-sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  const isAdmin = (session?.user as { role?: string })?.role === 'admin'

  return (
    <div className={isAdmin ? "mx-auto grid max-w-7xl md:grid-cols-[220px_1fr]" : "mx-auto max-w-7xl"}>
      {isAdmin && <AppSidebar admin />}
      {children}
    </div>
  )
}