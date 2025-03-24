"use client"

import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useTrips } from "@/lib/trip-context"

interface TripSummaryListProps {
  extended?: boolean
}

export function TripSummaryList({ extended = false }: TripSummaryListProps) {
  const { trips } = useTrips()

  // Get only the first 3 trips for the summary
  const displayTrips = trips.slice(0, 3)

  return (
    <div className="space-y-4">
      {displayTrips.map((trip) => (
        <div key={trip.id} className="flex flex-col space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold">{trip.name}</h3>
            <Badge
              variant={trip.status === "Active" ? "default" : trip.status === "Upcoming" ? "secondary" : "outline"}
            >
              {trip.status}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {trip.startDate} to {trip.endDate}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{trip.location}</span>
          </div>
          {extended && (
            <>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Budget Usage</span>
                  <span>
                    ${trip.spent} / ${trip.budget}
                  </span>
                </div>
                <Progress value={(trip.spent / trip.budget) * 100} />
              </div>
              <div className="text-sm text-muted-foreground">{trip.expenses} expenses recorded</div>
            </>
          )}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/trips/${trip.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

