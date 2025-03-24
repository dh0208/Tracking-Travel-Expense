"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Home, Menu, Plus, Settings, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu when route changes
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline">Travel Expense Tracker</span>
            <span className="sm:hidden">Expenses</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          <Link
            href="/dashboard"
            className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md hover:text-primary hover:bg-accent ${
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
            {pathname === "/dashboard" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Link>
          <Link
            href="/expenses"
            className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md hover:text-primary hover:bg-accent ${
              pathname === "/expenses" || pathname.startsWith("/expenses/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Expenses
            {(pathname === "/expenses" || pathname.startsWith("/expenses/")) && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Link>
          <Link
            href="/trips"
            className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md hover:text-primary hover:bg-accent ${
              pathname === "/trips" || pathname.startsWith("/trips/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Trips
            {(pathname === "/trips" || pathname.startsWith("/trips/")) && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Link>
          <Link
            href="/reports"
            className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md hover:text-primary hover:bg-accent ${
              pathname === "/reports" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Reports
            {pathname === "/reports" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild className="hidden md:flex">
            <Link href="/expenses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Expense
            </Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] p-6 pr-0">
              <SheetHeader className="mb-6 flex justify-between items-center">
                <SheetTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Travel Expense Tracker
                </SheetTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetHeader>
              <nav className="grid gap-4 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    pathname === "/dashboard"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={handleLinkClick}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/expenses"
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    pathname === "/expenses" || pathname.startsWith("/expenses/")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={handleLinkClick}
                >
                  <CreditCard className="h-5 w-5" />
                  Expenses
                </Link>
                <Link
                  href="/trips"
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    pathname === "/trips" || pathname.startsWith("/trips/")
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={handleLinkClick}
                >
                  <CreditCard className="h-5 w-5" />
                  Trips
                </Link>
                <Link
                  href="/reports"
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    pathname === "/reports"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={handleLinkClick}
                >
                  <BarChart3 className="h-5 w-5" />
                  Reports
                </Link>
                <Link
                  href="/settings"
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    pathname === "/settings"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={handleLinkClick}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>

                <div className="mt-6 border-t pt-6">
                  <Button className="w-full" asChild>
                    <Link href="/expenses/new" onClick={handleLinkClick}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Expense
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

