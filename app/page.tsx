import Link from "next/link"
import { ArrowRight, BarChart3, CreditCard, Globe, MapPin, Receipt, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Track Your Travel Expenses with Ease
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simplify your business travel with our comprehensive expense tracking solution. Upload receipts, track
                  mileage, and generate reports.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button className="gap-1">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/expenses/new">
                  <Button variant="outline">Add New Expense</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Receipt className="h-8 w-8 text-primary" />
                  <div className="grid gap-1">
                    <CardTitle>Receipt Uploads</CardTitle>
                    <CardDescription>Capture and store receipts digitally</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Easily upload receipts from your phone or computer. Our OCR technology automatically extracts key
                    information.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Globe className="h-8 w-8 text-primary" />
                  <div className="grid gap-1">
                    <CardTitle>Currency Conversion</CardTitle>
                    <CardDescription>Automatic currency conversion</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Record expenses in any currency and automatically convert to your base currency using real-time
                    exchange rates.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div className="grid gap-1">
                    <CardTitle>Visual Reports</CardTitle>
                    <CardDescription>Analyze your spending patterns</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate visual reports to understand your spending patterns and identify cost-saving opportunities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <MapPin className="h-8 w-8 text-primary" />
                  <div className="grid gap-1">
                    <CardTitle>Location Tagging</CardTitle>
                    <CardDescription>Track expenses by location</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tag expenses with location data for better organization and trip-specific reporting.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <div className="grid gap-1">
                    <CardTitle>Reimbursement Tracking</CardTitle>
                    <CardDescription>Monitor reimbursement status</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Keep track of which expenses have been submitted, approved, and reimbursed.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Wallet className="h-8 w-8 text-primary" />
                  <div className="grid gap-1">
                    <CardTitle>Budgeting Tools</CardTitle>
                    <CardDescription>Set and track travel budgets</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create budgets for trips or expense categories and track your spending against them.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

