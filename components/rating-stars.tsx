import { Star } from 'lucide-react'
import type { RatingStarsProps } from '@/lib/types'

export function RatingStars({ rating, count, size = 'md' }: RatingStarsProps) {
  const iconClass = size === 'sm' ? 'size-3' : size === 'lg' ? 'size-5' : 'size-4'
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${rating} out of 5 stars${count ? `, ${count} reviews` : ''}`}>
      <span className="inline-flex text-amber-500">
        {Array.from({ length: 5 }, (_, index) => <Star key={index} className={iconClass} fill={index < Math.round(rating) ? 'currentColor' : 'none'} />)}
      </span>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-sm text-muted-foreground">({count})</span>}
    </span>
  )
}
