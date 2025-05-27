"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  //specialty is enum so we can use z.enum() if we have predefined specialties
  specialty: z.enum(
    [
      "Cardiology",
      "Dermatology",
      "Endocrinology",
      "Gastroenterology",
      "General Medicine",
      "Neurology",
      "Oncology",
      "Pediatrics",
      "Psychiatry",
      "Surgery",
    ],
    {
      errorMap: () => ({ message: "Please select a valid specialty." }),
    }
  ),

  hospital: z.string().min(2, {
    message: "Hospital name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  rate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Rate must be a positive number.",
  }),
  availability: z.string().min(2, {
    message: "Please provide availability information.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
});

export function AddDoctorForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      specialty: "General Medicine", 
      hospital: "",
      location: "",
      rate: "",
      availability: "",
      bio: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // This would be replaced with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Doctor added successfully",
        description: `${values.name} has been added to the platform.`,
      });

      router.push("/admin/doctors");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The doctor could not be added. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="doctor@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialty</FormLabel>
                <FormControl>
                  <Input placeholder="General Medicine" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hospital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital/Clinic</FormLabel>
                <FormControl>
                  <Input placeholder="City General Hospital" {...field} />
                </FormControl>
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
                  <Input placeholder="New York, NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate ($/minute)</FormLabel>
                <FormControl>
                  <Input placeholder="100" {...field} />
                </FormControl>
                <FormDescription>Consultation rate per minute</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Input placeholder="Mon, Wed, Fri: 9AM-5PM" {...field} />
              </FormControl>
              <FormDescription>
                When the doctor is available for consultations
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the doctor's background and expertise"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-curex hover:bg-curex-dark text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Doctor
          </Button>
        </div>
      </form>
    </Form>
  );
}
