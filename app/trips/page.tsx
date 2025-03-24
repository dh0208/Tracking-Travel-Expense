"use client"

import { useState } from "react"
import { CalendarDays, MapPin, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddTripModal } from "@/components/add-trip-modal"
import { useTrips } from "@/lib/trip-context"
import Link from "next/link"

export default function TripsPage() {
  const { trips } = useTrips()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false)

  // Filter trips based on search term and status filter
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || trip.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Trips</h2>
        <Button onClick={() => setIsAddTripModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Trip
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex w-full items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trips..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "Active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Active")}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "Upcoming" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Upcoming")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={statusFilter === "Completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Completed")}
                >
                  Completed
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip Name</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">{trip.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>
                            {trip.startDate} to {trip.endDate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{trip.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>
                              ${trip.spent} / ${trip.budget}
                            </span>
                          </div>
                          <Progress value={(trip.spent / trip.budget) * 100} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trip.status === "Active" ? "default" : trip.status === "Upcoming" ? "secondary" : "outline"
                          }
                        >
                          {trip.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/trips/${trip.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddTripModal open={isAddTripModalOpen} onOpenChange={setIsAddTripModalOpen} />
    </div>
  )
}

