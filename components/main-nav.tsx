"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            XRayAnalyzer
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/projects"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/projects" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Proyectos
            </Link>
            <Link
              href="/reports"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/reports" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Reportes
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
