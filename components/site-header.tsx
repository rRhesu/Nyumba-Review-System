'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, LogOut, Menu, UserRound } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

const PRIVATE_PREFIXES = ['/admin', '/landlord']

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const show = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))
  if (!show) return null

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </span>
          Nyumba<span className="text-primary">Review</span>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? null : session?.user ? (
            <>
              <span className="hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium sm:flex">
                <UserRound className="size-4" />
                {session.user.name?.split(' ')[0] || 'Account'}
              </span>
              <button
                onClick={handleSignOut}
                className="hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent sm:flex"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </>
          ) : null}
          <button
            className="grid size-9 place-items-center rounded-lg border md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

