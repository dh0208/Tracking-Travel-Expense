import Link from "next/link"
import { CreditCard } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <p className="text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Travel Expense Tracker
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/help" className="hover:underline">
            Help
          </Link>
        </div>
      </div>
    </footer>
  )
}

