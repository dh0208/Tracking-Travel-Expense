"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for budgets
const budgets = [
  {
    id: "1",
    name: "Monthly Travel Budget",
    allocated: 10000,
    spent: 6800,
    remaining: 3200,
    period: "March 2023",
    status: "On Track",
  },
  {
    id: "2",
    name: "New York Conference",
    allocated: 3000,
    spent: 2100,
    remaining: 900,
    period: "Mar 12-16, 2023",
    status: "On Track",
  },
  {
    id: "3",
    name: "Quarterly Client Meetings",
    allocated: 5000,
    spent: 4800,
    remaining: 200,
    period: "Q1 2023",
    status: "At Risk",
  },
  {
    id: "4",
    name: "Team Building Events",
    allocated: 2000,
    spent: 1200,
    remaining: 800,
    period: "Q1 2023",
    status: "On Track",
  },
]

export function BudgetProgressList() {
  return (
    <div className="space-y-6">
      {budgets.map((budget) => (
        <div key={budget.id} className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-medium">{budget.name}</h3>
              <p className="text-sm text-muted-foreground">{budget.period}</p>
            </div>
            <Badge variant={budget.status === "On Track" ? "outline" : "destructive"}>{budget.status}</Badge>
          </div>
          <div className="space-y-1">
            <Progress value={(budget.spent / budget.allocated) * 100} />
            <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground gap-1">
              <span>
                ${budget.spent.toLocaleString()} spent of ${budget.allocated.toLocaleString()}
              </span>
              <span>${budget.remaining.toLocaleString()} remaining</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

