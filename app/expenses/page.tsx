"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpenses } from "@/lib/expense-context"
import { exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ExpensesPage() {
  const { expenses } = useExpenses()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [tripFilter, setTripFilter] = useState("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Filter expenses based on search term and filters
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.trip && expense.trip.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || expense.status === statusFilter
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
    const matchesTrip = tripFilter === "all" || expense.trip === tripFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesTrip
  })

  // Get unique categories, statuses, and trips for filters
  const categories = [...new Set(expenses.map((expense) => expense.category))]
  const statuses = [...new Set(expenses.map((expense) => expense.status))]
  const trips = [...new Set(expenses.filter((expense) => expense.trip).map((expense) => expense.trip))]

  // Handle export
  const handleExport = () => {
    if (isExporting) return
    setIsExporting(true)

    try {
      if (filteredExpenses.length > 0) {
        // Prepare data for export - simplify and clean up the data
        const exportData = filteredExpenses.map((expense) => ({
          Date: expense.date,
          Merchant: expense.merchant,
          Category: expense.category,
          Amount: expense.amount,
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
          toast({
            title: "Export failed",
            description: "There was a problem exporting your expenses",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Nothing to export",
          description: "There are no expenses matching your current filters",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error exporting:", error)
      toast({
        title: "Export failed",
        description: "There was a problem exporting your expenses",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/expenses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Expense
            </Link>
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex w-full items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter("all")
                        setIsDropdownOpen(false)
                      }}
                    >
                      All Statuses
                    </DropdownMenuItem>
                    {statuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => {
                          setStatusFilter(status)
                          setIsDropdownOpen(false)
                        }}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">Category</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setCategoryFilter("all")
                        setIsDropdownOpen(false)
                      }}
                    >
                      All Categories
                    </DropdownMenuItem>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => {
                          setCategoryFilter(category)
                          setIsDropdownOpen(false)
                        }}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">Trip</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setTripFilter("all")
                        setIsDropdownOpen(false)
                      }}
                    >
                      All Trips
                    </DropdownMenuItem>
                    {trips.map(
                      (trip) =>
                        trip && (
                          <DropdownMenuItem
                            key={trip}
                            onClick={() => {
                              setTripFilter(trip)
                              setIsDropdownOpen(false)
                            }}
                          >
                            {trip}
                          </DropdownMenuItem>
                        ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Trip</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell className="max-w-[120px] truncate" title={expense.merchant}>
                          {expense.merchant}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{expense.category}</TableCell>
                        <TableCell>
                          {expense.amount.toFixed(2)} {expense.currency}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{expense.trip || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              expense.status === "Reimbursed"
                                ? "default"
                                : expense.status === "Approved"
                                  ? "success"
                                  : "secondary"
                            }
                          >
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/expenses/${expense.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No expenses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

