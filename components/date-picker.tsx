"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  maxDate?: Date
  minDate?: Date
  disableFutureDates?: boolean
  disablePastDates?: boolean
}

export function DatePicker({
  date,
  setDate,
  maxDate,
  minDate,
  disableFutureDates = false,
  disablePastDates = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  // Function to handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setOpen(false)
  }

  // Calculate the minimum selectable date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Set minimum date to today if disablePastDates is true
  const minimumDate = disablePastDates ? today : minDate

  // Calculate the maximum selectable date
  const maximumDate = disableFutureDates ? today : maxDate

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          fromDate={minimumDate}
          toDate={maximumDate}
          disabled={(date) => {
            if (disablePastDates) {
              return date < today
            }
            return false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

