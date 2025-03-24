"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock location suggestions
const locationSuggestions = [
  "New York, USA",
  "London, UK",
  "Tokyo, Japan",
  "Berlin, Germany",
  "Paris, France",
  "Sydney, Australia",
]

interface LocationPickerProps {
  location: string
  setLocation: (location: string) => void
}

export function LocationPicker({ location, setLocation }: LocationPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)

  const filteredLocations = locationSuggestions.filter((loc) => loc.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectLocation = (loc: string) => {
    setLocation(loc)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !location && "text-muted-foreground")}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {location || <span>Select location</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-4">
          <div className="space-y-2">
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <div className="max-h-[200px] overflow-y-auto space-y-1 mt-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <Button
                    key={loc}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => selectLocation(loc)}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {loc}
                  </Button>
                ))
              ) : (
                <div className="py-2 text-center text-sm text-muted-foreground">No locations found</div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

