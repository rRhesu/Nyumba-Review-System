'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  Heart,
  House,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export type HomeListing = {
  id: number
  slug: string
  property_name: string
  location: string
  description: string
  units: string
  monthly_rent: string
}

const navItems = [
  { label: 'Find a home', href: '/apartments' },
  { label: 'For landlords', href: '/list-your-property' },
  { label: 'How it works', href: '/how-it-works' },
]

function parsePrice(value: string): number {
  const digits = value.replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : 0
}

function parseBedrooms(units: string): number {
  const match = units.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

export default function HomePage({ listings }: { listings: HomeListing[] }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const [location, setLocation] = useState('Nairobi')
  const [saved, setSaved] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [query, setQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState('any')
  const [bedroomFilter, setBedroomFilter] = useState('any')

  const filteredListings = useMemo(
    () =>
      listings.filter((listing) => {
        const matchesQuery = `${listing.property_name} ${listing.location} ${listing.units}`
          .toLowerCase()
          .includes(query.toLowerCase())
        const price = parsePrice(listing.monthly_rent)
        const matchesPrice =
          priceFilter === 'any' ||
          (priceFilter === 'budget'
            ? price <= 35000
            : priceFilter === 'mid'
              ? price > 35000 && price <= 60000
              : price > 60000)
        const bedrooms = parseBedrooms(listing.units)
        const matchesBedrooms =
          bedroomFilter === 'any' ||
          (bedroomFilter === 'one'
            ? bedrooms === 1
            : bedroomFilter === 'two'
              ? bedrooms === 2
              : bedrooms >= 3)
        return matchesQuery && matchesPrice && matchesBedrooms
      }),
    [listings, query, priceFilter, bedroomFilter],
  )

  function toggleSaved(id: number) {
    setSaved((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
    )
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  const featured = listings[0]

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#252827]">
      {/* Public header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2" aria-label="NyumbaReview home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#183d38] text-[#f3c98b]">
            <House size={19} strokeWidth={2.4} />
          </span>
          <span className="text-lg font-semibold tracking-[-0.04em]">
            Nyumba<span className="text-[#b27643]">Review</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-[#6c716d] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eef4ee] hover:text-[#183d38]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? null : session?.user ? (
            <>
              <Link
                href="/landlord"
                className="hidden items-center gap-2 rounded-full border border-[#d9ddd8] px-4 py-2.5 text-sm font-medium text-[#183d38] sm:flex"
              >
                <UserRound className="size-4" />
                {session.user.name?.split(' ')[0] || 'Account'}
              </Link>
              <button
                onClick={handleSignOut}
                className="hidden items-center gap-2 rounded-full bg-[#183d38] px-5 py-2.5 text-sm font-semibold text-white shadow-sm sm:flex"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/list-your-property"
                className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-[#183d38] sm:block"
              >
                List your property
              </Link>
              <Link
                href="/sign-in"
                className="hidden rounded-full bg-[#183d38] px-5 py-2.5 text-sm font-semibold text-white shadow-sm sm:block"
              >
                Sign in
              </Link>
            </>
          )}
          <button
            className="rounded-full border border-[#d9ddd8] p-2.5 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-10 sm:px-8 lg:px-10 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce4de] bg-[#eef4ee] px-3.5 py-2 text-xs font-semibold text-[#2e6457]">
              <ShieldCheck size={14} /> Trusted homes, real experiences
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[.98] tracking-[-0.07em] text-[#183d38] sm:text-6xl lg:text-[5.25rem]">
              Find a place that feels like <span className="text-[#c07e46]">home.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#6d7470] sm:text-lg">
              {session?.user
                ? `Welcome back, ${session.user.name?.split(' ')[0]}. Search verified apartments and read honest reviews.`
                : 'Search verified apartments, read honest reviews from tenants, and make your next move with confidence.'}
            </p>

            <div className="mt-9 flex max-w-xl flex-col gap-2 rounded-2xl border border-[#e3e6e1] bg-white p-2 shadow-[0_16px_50px_rgba(42,62,52,.08)] sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <MapPin className="text-[#b27643]" size={19} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#9da39e]">
                    Where
                  </span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    aria-label="Location"
                    className="bg-transparent text-sm font-semibold outline-none"
                  >
                    <option>Nairobi</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                    <option>Nakuru</option>
                  </select>
                </div>
              </div>
              <div className="hidden h-9 w-px bg-[#e8ebe7] sm:block" />
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <Search className="text-[#9da39e]" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by area or apartment"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a6aaa6]"
                />
              </div>
              <Link
                href="/apartments"
                className="rounded-xl bg-[#c27e45] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#a96736]"
              >
                Search homes
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-[#747c77]">
              <span className="flex items-center gap-2">
                <BadgeCheck className="text-[#b27643]" size={16} /> Verified listings
              </span>
              <span className="flex items-center gap-2">
                <Users className="text-[#b27643]" size={16} /> 2,400+ tenant reviews
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-3 -top-5 size-28 rounded-full bg-[#e8bd86]/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#d4c8b5] shadow-[0_25px_70px_rgba(46,62,52,.18)]">
              <img
                src="/nyumbareview-hero.png"
                alt="Modern apartment complex in Nairobi"
                className="aspect-[.95] w-full object-cover lg:aspect-[.93]"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/30 bg-white/90 p-4 backdrop-blur-sm">
                <div>
                  <p className="text-xs text-[#717671]">Featured this week</p>
                  <p className="mt-1 text-base font-semibold text-[#183d38]">
                    {featured?.property_name || 'NyumbaReview'}
                  </p>
                  <p className="mt-0.5 text-xs text-[#717671]">
                    {featured
                      ? `${featured.location} · From ${featured.monthly_rent}`
                      : 'Verified rentals in Kenya'}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#f7ecdf] px-3 py-2 text-xs font-bold text-[#a76438]">
                  <Star size={13} fill="currentColor" /> 4.8
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#e6e8e4] bg-white/70 py-7">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 text-sm text-[#68716b] sm:px-8 lg:px-10">
          <span className="font-semibold text-[#183d38]">A better way to rent in Kenya</span>
          <span className="flex items-center gap-2">
            <Check size={16} className="text-[#b27643]" /> No hidden listing fees
          </span>
          <span className="flex items-center gap-2">
            <Check size={16} className="text-[#b27643]" /> Honest tenant reviews
          </span>
          <span className="flex items-center gap-2">
            <Check size={16} className="text-[#b27643]" /> M-Pesa ready
          </span>
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b27643]">
              Explore verified spaces
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#183d38] sm:text-4xl">
              Homes people are talking about
            </h2>
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className="flex items-center gap-2 self-start rounded-full border border-[#daddd8] bg-white px-4 py-2.5 text-sm font-semibold text-[#183d38] sm:self-auto"
          >
            <SlidersHorizontal size={16} /> Filters
            <ChevronDown
              size={15}
              className={showFilters ? 'rotate-180 transition' : 'transition'}
            />
          </button>
        </div>

        {showFilters && (
          <div className="mt-5 flex flex-wrap gap-3 rounded-2xl border border-[#e1e5e0] bg-white p-4 text-sm">
            <label className="flex items-center gap-2 rounded-full border border-[#dce4de] px-3 py-2 font-medium text-[#2e6457]">
              Price
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                aria-label="Price filter"
                className="bg-transparent font-semibold outline-none"
              >
                <option value="any">Any</option>
                <option value="budget">Under 35k</option>
                <option value="mid">35k–60k</option>
                <option value="high">Over 60k</option>
              </select>
            </label>

            <label className="flex items-center gap-2 rounded-full border border-[#dce4de] px-3 py-2 font-medium text-[#2e6457]">
              Bedrooms
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                aria-label="Bedroom filter"
                className="bg-transparent font-semibold outline-none"
              >
                <option value="any">Any</option>
                <option value="one">1</option>
                <option value="two">2</option>
                <option value="three">3+</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => {
                setPriceFilter('any')
                setBedroomFilter('any')
              }}
              className="rounded-full px-4 py-2 font-medium text-[#a76438] hover:bg-[#f7ecdf]"
            >
              Clear filters
            </button>
          </div>
        )}

        {filteredListings.length === 0 ? (
          <div className="mt-9 rounded-2xl border border-dashed border-[#dce1dc] p-12 text-center">
            <p className="font-medium text-[#183d38]">No listings match your filters.</p>
            <p className="mt-1 text-sm text-[#7c827e]">
              Try clearing the filters or searching a different area.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {filteredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/apartments/${listing.slug}`}
                className="group block overflow-hidden rounded-2xl border border-[#e2e5e1] bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(42,62,52,.1)]"
              >
                <div className="relative aspect-[1.25] bg-gradient-to-br from-[#d7b37e] to-[#8a5f42]">
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#2e6457]">
                    Verified
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleSaved(listing.id)
                    }}
                    className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 text-[#183d38]"
                    aria-label={`${saved.includes(listing.id) ? 'Remove' : 'Save'} ${listing.property_name}`}
                  >
                    <Heart
                      size={17}
                      fill={saved.includes(listing.id) ? '#c27e45' : 'none'}
                      className={saved.includes(listing.id) ? 'text-[#c27e45]' : ''}
                    />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-.03em] text-[#183d38]">
                        {listing.property_name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#7c827e]">
                        <MapPin size={13} /> {listing.location}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#b27643]">
                      <Star size={13} fill="currentColor" /> 4.5
                    </span>
                  </div>
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#929892]">{listing.units}</p>
                      <p className="mt-1 text-base font-bold text-[#183d38]">
                        {listing.monthly_rent}
                        <span className="text-xs font-normal text-[#929892]"> / month</span>
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f2f5f1] p-2.5 text-[#2e6457]">
                      <MessageCircle size={17} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {listings.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/apartments"
              className="inline-flex items-center gap-2 rounded-full bg-[#183d38] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f2b27]"
            >
              See all available homes <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* Landlord CTA */}
      <section className="mx-5 mb-12 overflow-hidden rounded-[2rem] bg-[#183d38] sm:mx-8 lg:mx-auto lg:max-w-7xl">
        <div className="flex flex-col justify-between gap-8 px-7 py-10 sm:px-12 lg:flex-row lg:items-center lg:px-16 lg:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e7bd87]">
              For landlords & property managers
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-.05em] text-white sm:text-4xl">
              Good spaces deserve to be found.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[#bdd0c6]">
              Reach quality tenants, manage your listings, and build trust with verified
              reviews — all in one simple workspace.
            </p>
          </div>
          <Link
            href="/list-your-property"
            className="flex shrink-0 items-center gap-3 self-start rounded-full bg-[#e7bd87] px-6 py-3.5 text-sm font-bold text-[#183d38] transition hover:bg-white"
          >
            Start listing your property <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-9 text-xs text-[#8a928c] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <span className="font-semibold text-[#183d38]">NyumbaReview</span>
        <span>Making renting more transparent, one home at a time.</span>
        <span className="flex gap-5">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </span>
      </footer>
    </main>
  )
}

