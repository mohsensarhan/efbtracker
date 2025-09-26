import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = {
  neutral:
    "bg-[rgba(76,154,255,0.12)] text-[rgba(198,221,255,0.9)] border border-[rgba(76,154,255,0.2)]",
  positive:
    "bg-[rgba(34,197,94,0.12)] text-[rgba(167,243,208,0.9)] border border-[rgba(34,197,94,0.2)]",
  warning:
    "bg-[rgba(245,158,11,0.12)] text-[rgba(253,230,138,0.9)] border border-[rgba(245,158,11,0.2)]",
  critical:
    "bg-[rgba(239,68,68,0.12)] text-[rgba(254,202,202,0.9)] border border-[rgba(239,68,68,0.2)]",
  subtle:
    "bg-[rgba(58,58,58,0.35)] text-[rgba(205,205,205,0.85)] border border-[rgba(90,90,90,0.4)]",
}

type BadgeVariant = keyof typeof badgeVariants

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, children, variant = "neutral", leadingIcon, trailingIcon, ...props },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-pill)] px-[var(--space-2)] py-[4px] text-xs font-medium uppercase tracking-[0.08em]",
          badgeVariants[variant],
          className
        )}
        {...props}
      >
        {leadingIcon && <span aria-hidden>{leadingIcon}</span>}
        <span>{children}</span>
        {trailingIcon && <span aria-hidden>{trailingIcon}</span>}
      </span>
    )
  }
)

Badge.displayName = "Badge"

export { Badge, type BadgeVariant }
