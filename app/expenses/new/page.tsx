"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Upload, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DatePicker } from "@/components/date-picker"
import { LocationPicker } from "@/components/location-picker"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useExpenses } from "@/lib/expense-context"

// Define the form validation schema with Zod
const expenseFormSchema = z.object({
  date: z.date({
    required_error: "A date is required",
  }),
  merchant: z.string().min(2, {
    message: "Merchant name must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive({
      message: "Amount must be a positive number.",
    }),
  currency: z.string({
    required_error: "Please select a currency.",
  }),
  trip: z.string().optional(),
  location: z.string().optional(),
  notes: z
    .string()
    .max(500, {
      message: "Notes must not exceed 500 characters.",
    })
    .optional()
    .or(z.literal("")),
})

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

// Default values for the form
const defaultValues: Partial<ExpenseFormValues> = {
  currency: "USD",
  notes: "",
}

export default function NewExpensePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addExpense } = useExpenses()
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues,
    mode: "onSubmit", // Only validate on submit
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Receipt file must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image (JPEG, PNG, GIF) or PDF file",
          variant: "destructive",
        })
        return
      }

      setReceiptFile(file)
    }
  }

  // Handle form submission
  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      setIsSubmitting(true)

      // Format the date as a string in MM/DD/YYYY format for better compatibility
      const date = data.date
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`

      // Add the expense to the context
      addExpense({
        ...data,
        date: formattedDate,
      })

      // Show success toast
      toast({
        title: "Expense added",
        description: "Your expense has been successfully added.",
      })

      // Navigate to expenses page
      router.push("/expenses")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem adding your expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/expenses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Expenses
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add New Expense</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
                <CardDescription>Enter the basic information about your expense</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Date <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker date={field.value} setDate={field.onChange} disableFutureDates={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="merchant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Merchant <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter merchant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Accommodation">Accommodation</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Meals">Meals</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Amount <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Currency <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Add more details to categorize your expense</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="trip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trip" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="New York Conference">New York Conference</SelectItem>
                          <SelectItem value="Berlin Client Meeting">Berlin Client Meeting</SelectItem>
                          <SelectItem value="Tokyo Office Visit">Tokyo Office Visit</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <LocationPicker location={field.value || ""} setLocation={(loc) => field.onChange(loc)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="receipt">Receipt</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("receipt-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Receipt
                    </Button>
                    <Input
                      id="receipt-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {receiptFile && (
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">{receiptFile.name}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Accepted formats: JPEG, PNG, GIF, PDF (max 5MB)</p>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any additional notes about this expense" rows={4} {...field} />
                      </FormControl>
                      <FormDescription>Add any relevant details about this expense.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Alert variant="default" className="bg-muted">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Fields marked with <span className="text-destructive">*</span> are required.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Button variant="outline" asChild className="sm:order-1 order-2">
              <Link href="/expenses">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting} className="sm:order-2 order-1">
              {isSubmitting ? "Saving..." : "Save Expense"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

