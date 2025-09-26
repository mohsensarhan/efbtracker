import * as React from "react"

import { cn } from "@/lib/utils"

const CARD_BASE = "surface-panel rounded-[var(--radius-lg)]"
const CARD_SHADOW = "shadow-[var(--shadow-level-1)]"
const CARD_BORDER = "border border-[var(--color-border-subtle)]"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(CARD_BASE, CARD_SHADOW, CARD_BORDER, "flex flex-col gap-[var(--space-4)]", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "px-[var(--space-6)] pt-[var(--space-6)] pb-[var(--space-3)]",
        "flex flex-col gap-[var(--space-1)]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-metric text-lg font-medium tracking-[var(--tracking-tight)] text-[var(--color-text-primary)]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-[var(--color-text-tertiary)] text-sm tracking-[var(--tracking-base)]",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto flex items-center gap-[var(--space-2)]", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-[var(--space-6)] pb-[var(--space-6)]",
        "flex flex-col gap-[var(--space-3)]",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "px-[var(--space-6)] pb-[var(--space-6)]",
        "flex items-center gap-[var(--space-2)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
