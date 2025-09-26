"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="relative size-9 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-tertiary)] backdrop-blur-sm transition-all duration-[var(--duration-base)] hover:border-[var(--color-border-strong)] hover:bg-[rgba(76,154,255,0.12)] hover:shadow-[var(--shadow-level-1)]"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-[var(--duration-base)] dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-[var(--duration-base)] dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex cursor-pointer items-center gap-[var(--space-2)]"
        >
          <Sun className="h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex cursor-pointer items-center gap-[var(--space-2)]"
        >
          <Moon className="h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex cursor-pointer items-center gap-[var(--space-2)]"
        >
          <div className="h-4 w-4 rounded-full border-2 border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--color-surface-primary)] to-[var(--color-surface-tertiary)]" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
