"use client"

import { useState, useCallback } from "react"
import { Download, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/date-picker"
import { ExpenseSummaryChart } from "@/components/expense-summary-chart"
import { ExpensesByCategoryChart } from "@/components/expenses-by-category-chart"
import { RecentExpensesTable } from "@/components/recent-expenses-table"
import { exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useExpenses } from "@/lib/expense-context"

// Helper function to parse date strings in various formats
function parseDate(dateString: string): Date | null {
  try {
    // Try MM/DD/YYYY format
    const mmddyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    if (mmddyyyy.test(dateString)) {
      const [, month, day, year] = mmddyyyy.exec(dateString) || []
      return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    }

    // Try YYYY-MM-DD format
    const yyyymmdd = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
    if (yyyymmdd.test(dateString)) {
      const [, year, month, day] = yyyymmdd.exec(dateString) || []
      return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    }

    return null
  } catch (error) {
    console.error("Error parsing date:", error)
    return null
  }
}

// Helper function to check if a date is within a range
function isDateInRange(dateStr: string, startDate: Date | undefined, endDate: Date | undefined): boolean {
  if (!startDate && !endDate) return true

  const date = parseDate(dateStr)
  if (!date) return true // If we can't parse the date, include it

  // Set time to midnight for consistent comparison
  const start = startDate ? new Date(startDate) : undefined
  if (start) {
    start.setHours(0, 0, 0, 0)
  }

  const end = endDate ? new Date(endDate) : undefined
  if (end) {
    end.setHours(23, 59, 59, 999) // End of day
  }

  if (start && end) {
    return date >= start && date <= end
  } else if (start) {
    return date >= start
  } else if (end) {
    return date <= end
  }

  return true
}

export default function ReportsPage() {
  const { expenses } = useExpenses()
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [filteredExpenses, setFilteredExpenses] = useState(expenses)
  const [isFiltering, setIsFiltering] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")

  // Handle tab change
  const handleTabChange = (value: string) => {
    // Update the active tab state without navigation
    setActiveTab(value)
  }

  // Calculate summary statistics
  const calculateSummary = useCallback(() => {
    if (!filteredExpenses || filteredExpenses.length === 0) {
      return {
        totalExpenses: 0,
        averagePerDay: 0,
        topCategory: "None",
        topCategoryAmount: 0,
        topCategoryPercentage: 0,
        tripCount: 0,
        totalDays: 0,
      }
    }

    // Calculate total expenses (simplified - assuming all in USD)
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Calculate unique dates to get day count
    const uniqueDates = new Set(filteredExpenses.map((expense) => expense.date))
    const dayCount = uniqueDates.size

    // Calculate average per day
    const averagePerDay = dayCount > 0 ? totalExpenses / dayCount : 0

    // Find top category
    const categoryTotals: Record<string, number> = {}
    filteredExpenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0
      }
      categoryTotals[expense.category] += expense.amount
    })

    let topCategory = "None"
    let topCategoryAmount = 0

    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > topCategoryAmount) {
        topCategory = category
        topCategoryAmount = amount
      }
    })

    // Calculate top category percentage
    const topCategoryPercentage = totalExpenses > 0 ? (topCategoryAmount / totalExpenses) * 100 : 0

    // Count unique trips
    const uniqueTrips = new Set(filteredExpenses.filter((expense) => expense.trip).map((expense) => expense.trip))

    return {
      totalExpenses,
      averagePerDay,
      topCategory,
      topCategoryAmount,
      topCategoryPercentage,
      tripCount: uniqueTrips.size,
      totalDays: dayCount,
    }
  }, [filteredExpenses])

  // Apply date filter to expenses
  const applyDateFilter = useCallback(() => {
    setIsFiltering(true)

    try {
      // If no dates are selected, show all expenses
      if (!startDate && !endDate) {
        setFilteredExpenses(expenses)
        setIsFiltering(false)
        return
      }

      // Filter expenses based on date range
      const filtered = expenses.filter((expense) => isDateInRange(expense.date, startDate, endDate))

      setFilteredExpenses(filtered)

      if (filtered.length === 0 && expenses.length > 0) {
        toast({
          title: "No expenses found",
          description: "No expenses match the selected date range",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Filter applied",
          description: `Showing ${filtered.length} expenses in the selected date range`,
        })
      }
    } catch (error) {
      console.error("Error applying filter:", error)
      toast({
        title: "Error applying filter",
        description: "There was a problem filtering the expenses",
        variant: "destructive",
      })
      // Fallback to showing all expenses
      setFilteredExpenses(expenses)
    } finally {
      setIsFiltering(false)
    }
  }, [expenses, startDate, endDate, toast])

  // Reset filters
  const resetFilters = useCallback(() => {
    setStartDate(undefined)
    setEndDate(undefined)
    setFilteredExpenses(expenses)
    toast({
      title: "Filters reset",
      description: "Showing all expenses",
    })
  }, [expenses, toast])

  // Export report data
  const exportReport = useCallback(() => {
    if (isExporting) return
    setIsExporting(true)

    try {
      const summary = calculateSummary()

      // Create report data based on filtered expenses
      const reportData = [
        {
          Period:
            startDate && endDate
              ? `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
              : startDate
                ? `From ${startDate.toLocaleDateString()}`
                : endDate
                  ? `Until ${endDate.toLocaleDateString()}`
                  : "All Time",
          TotalExpenses: `$${summary.totalExpenses.toFixed(2)}`,
          AveragePerDay: `$${summary.averagePerDay.toFixed(2)}`,
          TopCategory: summary.topCategory,
          CategoryAmount: `$${summary.topCategoryAmount.toFixed(2)}`,
          CategoryPercentage: `${summary.topCategoryPercentage.toFixed(1)}%`,
          TripCount: summary.tripCount.toString(),
          TotalDays: summary.totalDays.toString(),
        },
      ]

      const success = exportToCSV(reportData, `expense-report-${new Date().toISOString().split("T")[0]}.csv`)

      if (success) {
        toast({
          title: "Report exported",
          description: "Your expense report has been exported to CSV",
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("Error exporting report:", error)
      toast({
        title: "Export failed",
        description: "There was a problem exporting your report",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [isExporting, startDate, endDate, toast, calculateSummary])

  // Export expense data
  const exportExpenses = useCallback(() => {
    if (isExporting) return
    setIsExporting(true)

    try {
      if (filteredExpenses.length === 0) {
        toast({
          title: "Nothing to export",
          description: "There are no expenses to export",
          variant: "destructive",
        })
        setIsExporting(false)
        return
      }

      // Prepare data for export
      const exportData = filteredExpenses.map((expense) => ({
        Date: expense.date,
        Merchant: expense.merchant,
        Category: expense.category,
        Amount: expense.amount.toFixed(2),
        Currency: expense.currency,
        Trip: expense.trip || "",
        Status: expense.status,
        Notes: expense.notes || "",
      }))

      const success = exportToCSV(exportData, `expenses-${new Date().toISOString().split("T")[0]}.csv`)

      if (success) {
        toast({
          title: "Export successful",
          description: `${exportData.length} expenses exported to CSV`,
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("Error exporting expenses:", error)
      toast({
        title: "Export failed",
        description: "There was a problem exporting your expenses",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [filteredExpenses, isExporting, toast])

  const summary = calculateSummary()

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportReport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            Export Summary
          </Button>
          <Button variant="outline" onClick={exportExpenses} disabled={isExporting || filteredExpenses.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="grid gap-2 w-full md:w-auto">
          <span className="text-sm font-medium">Start Date</span>
          <DatePicker date={startDate} setDate={setStartDate} maxDate={endDate} />
        </div>
        <div className="grid gap-2 w-full md:w-auto">
          <span className="text-sm font-medium">End Date</span>
          <DatePicker date={endDate} setDate={setEndDate} minDate={startDate} />
        </div>
        <div className="flex gap-2 mt-2 md:mt-0 self-end">
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={applyDateFilter} disabled={isFiltering}>
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={isFiltering || (!startDate && !endDate)}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.totalExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{filteredExpenses.length} expenses in selected period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Per Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.averagePerDay.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Over {summary.totalDays} days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.topCategory}</div>
                <p className="text-xs text-muted-foreground">
                  ${summary.topCategoryAmount.toFixed(2)} ({summary.topCategoryPercentage.toFixed(1)}%)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.tripCount}</div>
                <p className="text-xs text-muted-foreground">In selected period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseSummaryChart expenses={filteredExpenses} />
              </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpensesByCategoryChart expenses={filteredExpenses} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Expense Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={exportExpenses}
                disabled={isExporting || filteredExpenses.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <RecentExpensesTable customExpenses={filteredExpenses} showAll />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensesByCategoryChart expenses={filteredExpenses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length > 0 && filteredExpenses.some((e) => e.trip) ? (
                <div className="space-y-8">
                  {Array.from(new Set(filteredExpenses.filter((e) => e.trip).map((e) => e.trip))).map((trip) => {
                    if (!trip) return null

                    const tripExpenses = filteredExpenses.filter((e) => e.trip === trip)
                    const tripTotal = tripExpenses.reduce((sum, e) => sum + e.amount, 0)

                    return (
                      <div key={trip}>
                        <h3 className="text-lg font-medium mb-2">{trip}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Expenses</span>
                            <span>${tripTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Number of Expenses</span>
                            <span>{tripExpenses.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Date Range</span>
                            <span>
                              {tripExpenses.length > 0
                                ? `${tripExpenses[0].date} - ${tripExpenses[tripExpenses.length - 1].date}`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No trip expenses found in the selected date range.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

