"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExpenseSummaryChart } from "@/components/expense-summary-chart"
import { ExpensesByCategoryChart } from "@/components/expenses-by-category-chart"
import { RecentExpensesTable } from "@/components/recent-expenses-table"
import { TripSummaryList } from "@/components/trip-summary-list"
import { BudgetProgressList } from "@/components/budget-progress-list"

export default function DashboardPage() {
  // Use state to track the active tab
  const [activeTab, setActiveTab] = useState("overview")

  // Handle tab change
  const handleTabChange = (value: string) => {
    // Update the active tab state without navigation
    setActiveTab(value)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button asChild>
          <Link href="/expenses/new">
            <Plus className="mr-2 h-4 w-4" />
            New Expense
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,345.67</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reimbursements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,345.00</div>
                <p className="text-xs text-muted-foreground">5 expenses awaiting approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 upcoming in the next 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">$3,200 remaining this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Expense Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseSummaryChart />
              </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpensesByCategoryChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your most recent expenses across all trips</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentExpensesTable />
              </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle>Active Trips</CardTitle>
                <CardDescription>Your ongoing and upcoming trips</CardDescription>
              </CardHeader>
              <CardContent>
                <TripSummaryList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
                <CardDescription>Your expense trends over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ExpenseSummaryChart />
              </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Expense Categories</CardTitle>
                <CardDescription>Where most of your money is going</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpensesByCategoryChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip Summary</CardTitle>
              <CardDescription>Overview of your recent and upcoming trips</CardDescription>
            </CardHeader>
            <CardContent>
              <TripSummaryList extended />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Tracking</CardTitle>
              <CardDescription>Monitor your spending against budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetProgressList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

