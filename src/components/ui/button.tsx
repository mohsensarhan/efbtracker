import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const baseButton =
  "inline-flex items-center justify-center gap-[var(--space-1)] whitespace-nowrap font-medium transition-all select-none"
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-primary)]"
const disabledState = "disabled:pointer-events-none disabled:opacity-60"
const iconSlot =
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:w-4 [&_svg:not([class*='size-'])]:h-4"

const buttonVariants = cva(
  cn(baseButton, focusRing, disabledState, iconSlot, "rounded-[var(--radius-md)]"),
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-accent-primary)] text-[var(--color-text-primary)] shadow-[var(--shadow-level-1)] hover:bg-[var(--color-accent-primary-strong)]",
        secondary:
          "bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]",
        ghost:
          "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(76,154,255,0.08)]",
        destructive:
          "bg-[var(--color-accent-critical)] text-[var(--color-text-primary)] hover:bg-[#d43d3d] focus-visible:ring-[#fca5a5]",
        link: "text-[var(--color-accent-primary)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-[var(--space-2)] text-xs",
        md: "h-9 px-[var(--space-3)] text-sm",
        lg: "h-10 px-[var(--space-4)] text-sm",
        xl: "h-11 px-[var(--space-6)] text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

const buttonIntentVariants = cva("", {
  variants: {
    intent: {
      neutral: "",
      positive: "data-[intent='positive']:bg-[rgba(34,197,94,0.12)]",
      warning: "data-[intent='warning']:bg-[rgba(245,158,11,0.12)]",
    },
  },
  defaultVariants: {
    intent: "neutral",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    VariantProps<typeof buttonIntentVariants> {
  asChild?: boolean
  isProcessing?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      intent,
      asChild = false,
      isProcessing = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-processing={isProcessing ? "true" : undefined}
        className={cn(
          buttonVariants({ variant, size }),
          buttonIntentVariants({ intent }),
          isProcessing && "btn-processing",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
