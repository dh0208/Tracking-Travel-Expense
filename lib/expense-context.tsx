"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the expense type
export interface Expense {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  currency: string
  status: string
  trip?: string
  location?: string
  notes?: string
  receipt: boolean
}

// Initial mock data
const initialExpenses: Expense[] = [
  {
    id: "1",
    date: "03/15/2023",
    merchant: "Hilton Hotels",
    category: "Accommodation",
    amount: 245.5,
    currency: "USD",
    status: "Reimbursed",
    trip: "New York Conference",
    receipt: true,
  },
  {
    id: "2",
    date: "03/14/2023",
    merchant: "Uber",
    category: "Transportation",
    amount: 32.5,
    currency: "USD",
    status: "Pending",
    trip: "New York Conference",
    receipt: true,
  },
  {
    id: "3",
    date: "03/14/2023",
    merchant: "Starbucks",
    category: "Meals",
    amount: 8.75,
    currency: "USD",
    status: "Approved",
    trip: "New York Conference",
    receipt: true,
  },
  {
    id: "4",
    date: "02/28/2023",
    merchant: "Lufthansa",
    category: "Transportation",
    amount: 450,
    currency: "EUR",
    status: "Reimbursed",
    trip: "Berlin Client Meeting",
    receipt: false,
  },
  {
    id: "5",
    date: "02/27/2023",
    merchant: "Taxi",
    category: "Transportation",
    amount: 25,
    currency: "EUR",
    status: "Reimbursed",
    trip: "Berlin Client Meeting",
    receipt: false,
  },
]

// Create the context
interface ExpenseContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, "id" | "status" | "receipt">) => void
  getExpense: (id: string) => Expense | undefined
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

// Create a provider component
export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  // Initialize with initial data, will be updated from localStorage if available
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [initialized, setInitialized] = useState(false)

  // Load expenses from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      const savedExpenses = localStorage.getItem("expenses")
      if (savedExpenses) {
        try {
          setExpenses(JSON.parse(savedExpenses))
        } catch (error) {
          console.error("Error parsing saved expenses:", error)
        }
      }
      setInitialized(true)
    }
  }, [initialized])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && initialized) {
      localStorage.setItem("expenses", JSON.stringify(expenses))
    }
  }, [expenses, initialized])

  // Function to add a new expense
  const addExpense = (expenseData: Omit<Expense, "id" | "status" | "receipt">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(), // Generate a unique ID
      status: "Pending", // Default status
      receipt: false, // Default receipt status
    }

    setExpenses((prevExpenses) => [newExpense, ...prevExpenses])
  }

  // Function to get a specific expense by ID
  const getExpense = (id: string) => {
    return expenses.find((expense) => expense.id === id)
  }

  return <ExpenseContext.Provider value={{ expenses, addExpense, getExpense }}>{children}</ExpenseContext.Provider>
}

// Create a hook to use the expense context
export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider")
  }
  return context
}

