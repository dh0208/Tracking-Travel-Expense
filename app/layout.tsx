import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { ExpenseProvider } from "@/lib/expense-context"
import { TripProvider } from "@/lib/trip-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel Expense Tracker",
  description: "Track your travel expenses with ease",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <ExpenseProvider>
              <TripProvider>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="flex-1">{children}</div>
                  <SiteFooter />
                </div>
                <Toaster />
              </TripProvider>
            </ExpenseProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'