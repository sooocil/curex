import type { Metadata } from "next"
import Link from "next/link"
import { DoctorsTable } from "@/components/admin/doctors-table"
import { DoctorsFilter } from "@/components/admin/doctors-filter"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Manage Doctors | Curex Admin",
  description: "Manage doctors in the Curex platform",
}

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
        <div className="flex items-center gap-4">
          <DoctorsFilter />
          <Button asChild className="bg-curex hover:bg-curex-dark text-white">
            <Link href="/dashboard/admin/doctors/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Doctor
            </Link>
          </Button>
        </div>
      </div>
      <DoctorsTable />
    </div>
  )
}
