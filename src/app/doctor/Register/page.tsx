import type { Metadata } from "next"
import { DoctorRegistrationForm } from "@/components/doctor/registration-form"

export const metadata: Metadata = {
  title: "Doctor Registration | Curex",
  description: "Register as a doctor on the Curex platform",
}

export default function DoctorRegistrationPage() {
  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Doctor Registration</h1>
        <p className="mt-2 text-lg text-gray-600">
          Join Curex as a healthcare provider and connect with patients online
        </p>
      </div>
      <DoctorRegistrationForm />
    </div>
  )
}
