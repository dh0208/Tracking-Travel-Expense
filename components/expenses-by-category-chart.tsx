"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import type { Expense } from "@/lib/expense-context"

// Helper function to group expenses by category
function groupExpensesByCategory(expenses: Expense[]) {
  const categoryData: Record<string, number> = {}

  // Group expenses by category
  expenses.forEach((expense) => {
    if (!categoryData[expense.category]) {
      categoryData[expense.category] = 0
    }
    categoryData[expense.category] += expense.amount
  })

  // Convert to array format for the chart and sort by value
  const result = Object.entries(categoryData)
    .map(([name, value], index) => ({
      name,
      value,
      color: `hsl(var(--primary) / ${1 - index * 0.15})`,
    }))
    .sort((a, b) => b.value - a.value)

  return result
}

interface ExpensesByCategoryChartProps {
  expenses?: Expense[]
}

export function ExpensesByCategoryChart({ expenses = [] }: ExpensesByCategoryChartProps) {
  // Use useMemo to calculate chart data only when expenses change
  const chartData = useMemo(() => {
    if (expenses && expenses.length > 0) {
      try {
        const categoryData = groupExpensesByCategory(expenses)
        return categoryData.length > 0 ? categoryData : [{ name: "No Data", value: 1, color: "hsl(var(--muted))" }]
      } catch (error) {
        console.error("Error processing category data:", error)
        return [{ name: "Error", value: 1, color: "hsl(var(--muted))" }]
      }
    } else {
      // Default mock data if no expenses provided
      return [
        { name: "Accommodation", value: 3500, color: "hsl(var(--primary))" },
        { name: "Transportation", value: 2500, color: "hsl(var(--primary) / 0.8)" },
        { name: "Meals", value: 1500, color: "hsl(var(--primary) / 0.6)" },
        { name: "Entertainment", value: 800, color: "hsl(var(--primary) / 0.4)" },
        { name: "Other", value: 700, color: "hsl(var(--primary) / 0.2)" },
      ]
    }
  }, [expenses])

  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => (name && percent ? `${name} ${(percent * 100).toFixed(0)}%` : "")}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0 && payload[0]?.payload) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Category</span>
                        <span className="font-bold text-sm">{payload[0].name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Amount</span>
                        <span className="font-bold text-sm">${payload[0].value}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

