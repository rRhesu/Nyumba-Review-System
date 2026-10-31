export type Role = 'renter' | 'landlord' | 'admin'

export type User = { id: string; name: string; email: string; role: Role; avatar?: string }
export type Organization = { id: string; name: string; slug: string; ownerId: string }
export type ApartmentComplex = { id: string; slug: string; name: string; location: string; county: string; description: string; image: string; rating: number; reviewCount: number; amenities: string[]; unitsAvailable: number; priceFrom: number; verified: boolean; organizationId: string }
export type Review = { id: string; complexId: string; author: string; rating: number; title: string; body: string; createdAt: string; verified: boolean }
export type AdCampaign = { id: string; complexId: string; status: 'active' | 'paused' | 'draft'; budget: number; impressions: number; clicks: number }
export type Payment = { id: string; organizationId: string; amount: number; description: string; status: 'paid' | 'pending' | 'failed'; date: string }
export type Inquiry = { id: string; complexId: string; renterName: string; email: string; message: string; status: 'new' | 'responded'; createdAt: string }

export type ListingFilters = { location?: string; minPrice?: number; maxPrice?: number; amenities?: string[] }

export const formatKes = (amount: number) => `KES ${amount.toLocaleString()}`
export const roleLabel = (role: Role) => role.charAt(0).toUpperCase() + role.slice(1)

export const emptyListingFilters: ListingFilters = {}

type BrandImage = { src: string; alt: string }
export type ListingImage = BrandImage

export const isRole = (user: User | null, role: Role) => user?.role === role

export const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const DEFAULT_LISTING_IMAGE = '/nyumbareview-hero.png'

export type DashboardStat = { label: string; value: string; change?: string }

export type NavItem = { label: string; href: string; icon?: string }

export type Status = 'active' | 'paused' | 'draft' | 'paid' | 'pending' | 'failed' | 'new' | 'responded'

export type PageAction = { label: string; href?: string; onClick?: () => void }

export type SortOption = 'recommended' | 'rating' | 'price-low' | 'price-high'

export type MarketplaceState = { query: string; filters: ListingFilters; sort: SortOption }

export type FormState = { status: 'idle' | 'saving' | 'success' | 'error'; message?: string }

export type DataTableColumn<T> = { key: keyof T; label: string }

export type Metric = { label: string; value: number; trend: number }

export type Activity = { id: string; label: string; detail: string; time: string }

export type SelectOption = { label: string; value: string }

export type Maybe<T> = T | null

export type WithChildren = { children: React.ReactNode }

export type IconName = 'home' | 'building' | 'star' | 'users' | 'credit-card' | 'settings'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type SessionUser = Pick<User, 'id' | 'name' | 'email' | 'role'>

export type Session = { user: SessionUser } | null

export type ApiResponse<T> = { data?: T; error?: string }

export type ListingCardProps = { complex: ApartmentComplex; compact?: boolean }

export type RatingStarsProps = { rating: number; count?: number; size?: 'sm' | 'md' | 'lg' }

export type SidebarSection = { label: string; items: NavItem[] }

export type HeaderLink = { label: string; href: string }

export type FooterLinkGroup = { title: string; links: HeaderLink[] }

export type ReviewFormValues = { rating: number; title: string; body: string }

export type InquiryFormValues = { name: string; email: string; message: string }

export type CampaignFormValues = { complexId: string; budget: number }

export type Pagination = { page: number; pageSize: number; total: number }

export type Paginated<T> = { items: T[]; pagination: Pagination }

export type EmptyStateProps = { title: string; description: string; actionLabel?: string; actionHref?: string }

export type BreadcrumbItem = { label: string; href?: string }

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export type AlertMessage = { variant: AlertVariant; title: string; description: string }

export type ChartPoint = { label: string; value: number }

export type UserPreferences = { savedComplexIds: string[]; notifications: boolean }

export type AuditLog = { id: string; actor: string; action: string; resource: string; createdAt: string }

export type ModerationItem = { id: string; type: 'review' | 'listing' | 'user'; title: string; detail: string; status: 'pending' | 'approved' | 'rejected' }

export type BillingSummary = { currentBalance: number; nextPaymentDate: string; plan: string }

export type PropertyDraft = { name: string; location: string; description: string; image?: string }

export type UnitDraft = { unitNumber: string; bedrooms: number; bathrooms: number; rent: number; available: boolean }

export type ListingFormValues = PropertyDraft & UnitDraft

export type SearchSuggestion = { label: string; type: 'location' | 'complex' }

export type ThemeMode = 'light' | 'dark' | 'system'

export type Notification = { id: string; title: string; read: boolean; createdAt: string }

export type OrganizationMember = { userId: string; organizationId: string; role: Role }

export type Subscription = { id: string; organizationId: string; plan: 'starter' | 'growth' | 'pro'; status: 'active' | 'canceled' }

export type Unit = UnitDraft & { id: string; complexId: string }

export type ReviewSummary = { average: number; total: number; distribution: Record<1 | 2 | 3 | 4 | 5, number> }

export type Location = { name: string; county: string; listingCount: number }

export type ListingStatus = 'published' | 'pending' | 'rejected'

export type ManagedListing = ApartmentComplex & { status: ListingStatus }

export type UserRoleOption = { role: Role; description: string }

export type AuthContextValue = { user: User | null; setRole: (role: Role) => void; signOut: () => void }
