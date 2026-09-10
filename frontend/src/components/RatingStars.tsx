import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export default function RatingStars({ rating, size = 16, showValue = false, className = "" }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-accent-orange text-accent-orange" />
      ))}
      {hasHalf && <StarHalf size={size} className="fill-accent-orange text-accent-orange" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-border" />
      ))}
      {showValue && <span className="ml-1.5 text-sm font-medium text-ink-secondary">{rating.toFixed(1)}</span>}
    </div>
  );
}
