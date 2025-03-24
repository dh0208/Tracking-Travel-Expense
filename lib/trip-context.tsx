"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the trip type
export interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  status: "Active" | "Upcoming" | "Completed"
  budget: number
  spent: number
  expenses: number
}

// Initial mock data
const initialTrips: Trip[] = [
  {
    id: "1",
    name: "New York Conference",
    startDate: "2023-03-12",
    endDate: "2023-03-16",
    location: "New York, USA",
    status: "Active",
    budget: 3000,
    spent: 2100,
    expenses: 12,
  },
  {
    id: "2",
    name: "Berlin Client Meeting",
    startDate: "2023-04-05",
    endDate: "2023-04-08",
    location: "Berlin, Germany",
    status: "Upcoming",
    budget: 2500,
    spent: 0,
    expenses: 0,
  },
  {
    id: "3",
    name: "Tokyo Office Visit",
    startDate: "2023-05-10",
    endDate: "2023-05-17",
    location: "Tokyo, Japan",
    status: "Upcoming",
    budget: 5000,
    spent: 0,
    expenses: 0,
  },
  {
    id: "4",
    name: "San Francisco Team Building",
    startDate: "2023-02-15",
    endDate: "2023-02-18",
    location: "San Francisco, USA",
    status: "Completed",
    budget: 4000,
    spent: 3800,
    expenses: 18,
  },
  {
    id: "5",
    name: "London Sales Meeting",
    startDate: "2023-01-20",
    endDate: "2023-01-24",
    location: "London, UK",
    status: "Completed",
    budget: 3500,
    spent: 3200,
    expenses: 15,
  },
]

// Create the context
interface TripContextType {
  trips: Trip[]
  addTrip: (trip: Omit<Trip, "id" | "spent" | "expenses">) => void
  getTrip: (id: string) => Trip | undefined
}

const TripContext = createContext<TripContextType | undefined>(undefined)

// Create a provider component
export function TripProvider({ children }: { children: React.ReactNode }) {
  // Initialize with initial data, will be updated from localStorage if available
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [initialized, setInitialized] = useState(false)

  // Load trips from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      const savedTrips = localStorage.getItem("trips")
      if (savedTrips) {
        try {
          setTrips(JSON.parse(savedTrips))
        } catch (error) {
          console.error("Error parsing saved trips:", error)
        }
      }
      setInitialized(true)
    }
  }, [initialized])

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && initialized) {
      localStorage.setItem("trips", JSON.stringify(trips))
    }
  }, [trips, initialized])

  // Function to add a new trip
  const addTrip = (tripData: Omit<Trip, "id" | "spent" | "expenses">) => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(), // Generate a unique ID
      spent: 0, // Default spent
      expenses: 0, // Default expenses count
    }

    setTrips((prevTrips) => [newTrip, ...prevTrips])
  }

  // Function to get a specific trip by ID
  const getTrip = (id: string) => {
    return trips.find((trip) => trip.id === id)
  }

  return <TripContext.Provider value={{ trips, addTrip, getTrip }}>{children}</TripContext.Provider>
}

// Create a hook to use the trip context
export function useTrips() {
  const context = useContext(TripContext)
  if (context === undefined) {
    throw new Error("useTrips must be used within a TripProvider")
  }
  return context
}

