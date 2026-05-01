import { cn } from '@/lib/cn';

type Tier = 30 | 50 | 70;

const TIER_STYLES: Record<Tier, string> = {
  30: 'bg-[var(--color-green-deep)] text-[var(--color-cream)]',
  50: 'bg-[var(--color-warning)] text-[#3F2A09]',
  70: 'bg-[var(--color-terracotta)] text-[var(--color-cream)]',
};

interface DiscountBadgeProps {
  tier: Tier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DiscountBadge({ tier, size = 'md', className }: DiscountBadgeProps) {
  const sz =
    size === 'sm' ? 'text-[14px] px-2.5 py-1' :
    size === 'lg' ? 'text-[18px] px-4 py-1.5' :
    'text-[15px] px-3 py-1';
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium tracking-tight',
        TIER_STYLES[tier],
        sz,
        className
      )}
    >
      −{tier}%
    </span>
  );
}
