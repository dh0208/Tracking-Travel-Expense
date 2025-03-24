import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Update the exportToCSV function to format dates properly for Excel
export function exportToCSV(data: any[], filename: string): boolean {
  try {
    if (!data || data.length === 0) {
      console.error("No data to export")
      return false
    }

    // Get headers from the first item's keys
    const headers = Object.keys(data[0] || {}).filter(
      (key) =>
        // Filter out any complex objects that can't be easily converted to CSV
        typeof data[0][key] !== "object" || data[0][key] === null,
    )

    if (headers.length === 0) {
      console.error("No valid headers found for CSV export")
      return false
    }

    // Create CSV header row
    const csvRows = [headers.join(",")]

    // Add data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header]

        // Format dates for Excel compatibility
        if (header.toLowerCase().includes("date") && value) {
          // Check if it's a date string in ISO format (YYYY-MM-DD)
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            // Convert to MM/DD/YYYY format which Excel recognizes better
            const parts = value.split("-")
            if (parts.length >= 3) {
              return `"${parts[1]}/${parts[2].substring(0, 2)}/${parts[0]}"`
            }
          }
        }

        // Handle special cases and escape commas and quotes
        const escaped = value === null || value === undefined ? "" : String(value).replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(values.join(","))
    }

    // Combine into CSV string with BOM for Excel compatibility
    const BOM = "\uFEFF" // Byte Order Mark helps Excel with UTF-8
    const csvString = BOM + csvRows.join("\n")

    // Create a blob and download link
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })

    // Use the download API
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // For IE
      window.navigator.msSaveOrOpenBlob(blob, filename)
      return true
    }

    // For modern browsers
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up
    document.body.removeChild(link)

    // Clean up the URL object after a delay
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)

    return true
  } catch (error) {
    console.error("Error exporting to CSV:", error)
    return false
  }
}

