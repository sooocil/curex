"use client";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const medicalSpecialties = [
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
];
const formSchema = z.object({
  specialty: z.enum(
    medicalSpecialties as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a valid specialty." }),
    }
  ),
  hospital: z.string().min(2, {
    message: "Hospital/Clinic name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  rate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Rate must be a positive number.",
  }),
  availability: z.string().min(5, {
    message: "Please provide your availability details.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
});

interface ProfessionalInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ProfessionalInfoStep({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: ProfessionalInfoStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialty: formData.specialty || "",
      hospital: formData.hospital || "",
      location: formData.location || "",
      rate: formData.rate || "",
      availability: formData.availability || "",
      bio: formData.bio || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values);
    onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Professional Details</h2>
        <p className="text-sm text-gray-500">
          Tell us about your medical practice
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Specialty</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {medicalSpecialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Consultation Rate ($ per minute)</FormLabel>
                  <FormControl>
                    <Input placeholder="120" {...field} />
                  </FormControl>
                  <FormDescription>
                    Set your rate for online consultations
                  </FormDescription>
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
                <FormLabel>Availability Schedule</FormLabel>
                <FormControl>
                  <Input placeholder="Mon, Wed, Fri: 9AM-5PM" {...field} />
                </FormControl>
                <FormDescription>
                  When you are available for consultations
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
                <FormLabel>Professional Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Dr. Sarah Johnson is a board-certified cardiologist with over 10 years of experience..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your experience and specializations
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
            <Button
              type="submit"
              className={`${
                form.formState.isValid
                  ? "bg-curex hover:bg-curex-dark text-white "
                  : "bg-gray-300 text-gray-500 hover:cursor-not-allowed"
              } bg-curex hover:bg-curex-dark text-white`}
              disabled={!form.formState.isValid}
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
