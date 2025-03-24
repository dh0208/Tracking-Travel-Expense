"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/date-picker"
import { LocationPicker } from "@/components/location-picker"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTrips } from "@/lib/trip-context"
import { useToast } from "@/hooks/use-toast"

// Define the form validation schema with Zod
const tripFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Trip name must be at least 2 characters.",
    }),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
    location: z.string().min(2, {
      message: "Location must be at least 2 characters.",
    }),
    status: z.enum(["Active", "Upcoming", "Completed"], {
      required_error: "Please select a status.",
    }),
    budget: z.coerce
      .number({
        required_error: "Budget is required",
        invalid_type_error: "Budget must be a number",
      })
      .positive({
        message: "Budget must be a positive number.",
      }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })

type TripFormValues = z.infer<typeof tripFormSchema>

// Default values for the form
const defaultValues: Partial<TripFormValues> = {
  status: "Upcoming",
}

interface AddTripModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTripModal({ open, onOpenChange }: AddTripModalProps) {
  const { addTrip } = useTrips()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues,
    mode: "onSubmit",
  })

  // Handle form submission
  const onSubmit = async (data: TripFormValues) => {
    try {
      setIsSubmitting(true)

      // Format the dates as strings in YYYY-MM-DD format
      const formattedStartDate = format(data.startDate, "yyyy-MM-dd")
      const formattedEndDate = format(data.endDate, "yyyy-MM-dd")

      // Add the trip to the context
      addTrip({
        ...data,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })

      // Show success toast
      toast({
        title: "Trip added",
        description: "Your trip has been successfully added.",
      })

      // Close the modal and reset the form
      onOpenChange(false)
      form.reset(defaultValues)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem adding your trip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Trip</DialogTitle>
          <DialogDescription>Enter the details for your new trip. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Trip Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter trip name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Start Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      End Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} minDate={form.watch("startDate")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Location <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <LocationPicker location={field.value || ""} setLocation={(loc) => field.onChange(loc)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Budget <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Trip"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

