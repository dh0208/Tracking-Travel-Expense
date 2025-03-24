"use client"

import { useMemo } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import type { Expense } from "@/lib/expense-context"

// Helper function to group expenses by month
function groupExpensesByMonth(expenses: Expense[]) {
  const monthlyData: Record<string, number> = {}

  // Initialize with empty data for the last 12 months
  const today = new Date()
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
    monthlyData[monthKey] = 0
  }

  // Add expense amounts to the corresponding months
  expenses.forEach((expense) => {
    // Try to parse the date
    let expenseDate: Date | null = null

    // Try MM/DD/YYYY format
    const mmddyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    if (mmddyyyy.test(expense.date)) {
      const [, month, day, year] = mmddyyyy.exec(expense.date) || []
      expenseDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    }

    // Try YYYY-MM-DD format
    if (!expenseDate) {
      const yyyymmdd = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
      if (yyyymmdd.test(expense.date)) {
        const [, year, month, day] = yyyymmdd.exec(expense.date) || []
        expenseDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      }
    }

    if (expenseDate) {
      const monthKey = `${expenseDate.getFullYear()}-${(expenseDate.getMonth() + 1).toString().padStart(2, "0")}`
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey] += expense.amount
      }
    }
  })

  // Convert to array format for the chart
  return Object.entries(monthlyData).map(([key, value]) => {
    const [year, month] = key.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
    return {
      month: date.toLocaleString("default", { month: "short" }),
      expenses: value,
    }
  })
}

interface ExpenseSummaryChartProps {
  expenses?: Expense[]
}

export function ExpenseSummaryChart({ expenses = [] }: ExpenseSummaryChartProps) {
  // Use useMemo to calculate chart data only when expenses change
  const chartData = useMemo(() => {
    if (expenses && expenses.length > 0) {
      try {
        return groupExpensesByMonth(expenses)
      } catch (error) {
        console.error("Error processing chart data:", error)
        // Fallback to default data
        return [
          { month: "Jan", expenses: 0 },
          { month: "Feb", expenses: 0 },
          { month: "Mar", expenses: 0 },
          { month: "Apr", expenses: 0 },
          { month: "May", expenses: 0 },
          { month: "Jun", expenses: 0 },
          { month: "Jul", expenses: 0 },
          { month: "Aug", expenses: 0 },
          { month: "Sep", expenses: 0 },
          { month: "Oct", expenses: 0 },
          { month: "Nov", expenses: 0 },
          { month: "Dec", expenses: 0 },
        ]
      }
    } else {
      // Default mock data if no expenses provided
      return [
        { month: "Jan", expenses: 1200 },
        { month: "Feb", expenses: 1800 },
        { month: "Mar", expenses: 2400 },
        { month: "Apr", expenses: 1500 },
        { month: "May", expenses: 2100 },
        { month: "Jun", expenses: 1800 },
        { month: "Jul", expenses: 2200 },
        { month: "Aug", expenses: 2600 },
        { month: "Sep", expenses: 2900 },
        { month: "Oct", expenses: 3100 },
        { month: "Nov", expenses: 2800 },
        { month: "Dec", expenses: 3500 },
      ]
    }
  }, [expenses])

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            className="text-xs"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0 && payload[0]?.payload) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                        <span className="font-bold text-sm">{payload[0].payload.month}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Expenses</span>
                        <span className="font-bold text-sm">${payload[0].value}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 6, style: { fill: "hsl(var(--primary))" } }}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

