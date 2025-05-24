import { DoctorsFilter } from "@/components/admin/doctors-filter"
import { DoctorsList } from "@/components/dashboard/doctors-list"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Find Doctors | Curex",
  description: "Browse and connect with doctors on Curex",
}

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Find Doctors</h1>
        <DoctorsFilter />
      </div>
      <DoctorsList />
    </div>
  )
}
