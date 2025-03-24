"use client"

import Link from "next/link"
import { ReceiptText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useExpenses } from "@/lib/expense-context"
import type { Expense } from "@/lib/expense-context"

interface RecentExpensesTableProps {
  customExpenses?: Expense[]
  showAll?: boolean
}

export function RecentExpensesTable({ customExpenses, showAll = false }: RecentExpensesTableProps) {
  const { expenses: contextExpenses } = useExpenses()

  // Use custom expenses if provided, otherwise use context expenses
  const allExpenses = customExpenses || contextExpenses || []

  // Get the expenses to display (all or just recent)
  const displayExpenses = showAll ? allExpenses : allExpenses.slice(0, 4)

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayExpenses.length > 0 ? (
            displayExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="whitespace-nowrap">{expense.date}</TableCell>
                <TableCell className="max-w-[120px] truncate" title={expense.merchant}>
                  {expense.merchant}
                </TableCell>
                <TableCell className="hidden md:table-cell">{expense.category}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {expense.amount.toFixed(2)} {expense.currency}
                </TableCell>
                <TableCell className="hidden md:table-cell">
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
                  <div className="flex justify-end gap-2">
                    {expense.receipt && (
                      <Button variant="ghost" size="icon" title="View Receipt" className="hidden sm:inline-flex">
                        <ReceiptText className="h-4 w-4" />
                        <span className="sr-only">View Receipt</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/expenses/${expense.id}`}>View</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No expenses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

