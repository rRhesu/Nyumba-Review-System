'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Building2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
} from 'lucide-react'

const landlordItems = [
  { label: 'Overview', href: '/landlord', icon: LayoutDashboard },
  { label: 'My properties', href: '/landlord/properties', icon: Building2 },
  { label: 'Inquiries', href: '/landlord/inquiries', icon: MessageSquare },
  { label: 'Analytics', href: '/landlord/analytics', icon: BarChart3 },
]

const adminItems = [
  { label: 'Moderation', href: '/admin', icon: FileText },
  { label: 'Reviews', href: '/admin', icon: Star },
  { label: 'Marketplace', href: '/apartments', icon: Building2 },
  { label: 'Settings', href: '/admin', icon: Settings },
]

export function AppSidebar({ admin = false }: { admin?: boolean }) {
  const pathname = usePathname()
  const items = admin ? adminItems : landlordItems

  return (
    <aside className="border-r bg-card p-4 md:min-h-[calc(100vh-4rem)]">
      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Workspace
      </p>
      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}