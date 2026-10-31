import Link from 'next/link'
import { MapPin, ShieldCheck } from 'lucide-react'
import type { ApartmentComplex } from '@/lib/types'
import { formatKes } from '@/lib/types'
import { RatingStars } from './rating-stars'

export function ComplexCard({ complex, compact = false }: { complex: ApartmentComplex; compact?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className={`relative overflow-hidden bg-muted ${compact ? 'h-40' : 'h-52'}`}>
        <img src={complex.image} alt={complex.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {complex.verified && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold"><ShieldCheck className="size-3 text-primary" /> Verified</span>}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div><Link href={`/apartments/${complex.slug}`} className="text-lg font-semibold hover:text-primary">{complex.name}</Link><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{complex.location}</p></div>
        <RatingStars rating={complex.rating} count={complex.reviewCount} size="sm" />
        <p className="line-clamp-2 text-sm text-muted-foreground">{complex.description}</p>
        <div className="flex items-end justify-between border-t pt-3"><p><span className="text-xs text-muted-foreground">From</span><br /><span className="font-semibold text-primary">{formatKes(complex.priceFrom)}</span><span className="text-xs text-muted-foreground"> / month</span></p><span className="text-xs font-medium text-muted-foreground">{complex.unitsAvailable} units available</span></div>
      </div>
    </article>
  )
}
