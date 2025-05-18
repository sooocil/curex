import type { Metadata } from "next"
import { DoctorApplicationsTable } from "@/components/admin/doctor-applications-table"
import { DoctorApplicationsFilter } from "@/components/admin/doctor-applications-filter"

export const metadata: Metadata = {
  title: "Doctor Applications | Curex Admin",
  description: "Review and approve doctor applications",
}

export default function DoctorApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Doctor Applications</h1>
        <DoctorApplicationsFilter />
      </div>
      <DoctorApplicationsTable />
    </div>
  )
}
