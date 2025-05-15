"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  availability: z.string().min(5, {
    message: "Please provide your availability details.",
  }),
  rate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Rate must be a positive number.",
  }),
})

interface AvailabilityStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function AvailabilityStep({ formData, updateFormData, onNext, onPrev }: AvailabilityStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      availability: formData.availability || "",
      rate: formData.rate || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Availability & Rate</h2>
        <p className="text-sm text-gray-500">Set your consultation schedule and pricing</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability Schedule</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Monday, Wednesday, Friday: 9AM-5PM"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please specify the days and times you are available for online consultations
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Rate ($ per minute)</FormLabel>
                <FormControl>
                  <Input placeholder="100" {...field} />
                </FormControl>
                <FormDescription>Set your rate for online consultations (USD per minute)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
            <Button type="submit" className="bg-curex hover:bg-curex-dark text-white">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
