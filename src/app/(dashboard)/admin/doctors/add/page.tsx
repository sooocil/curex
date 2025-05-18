import type { Metadata } from "next"
import { AddDoctorForm } from "@/components/admin/add-doctor-form"

export const metadata: Metadata = {
  title: "Add Doctor | Curex Admin",
  description: "Add a new doctor to the Curex platform",
}

export default function AddDoctorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Add Doctor</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <AddDoctorForm />
      </div>
    </div>
  )
}
