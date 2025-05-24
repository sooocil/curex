import { AppointmentHistoryTable } from "@/components/dashboard/appointmentsHistoryTable"
import { AppointmentHistoryFilter } from "@/components/dashboard/appointment-history-filter"

export default function AppointmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <AppointmentHistoryFilter />
      </div>
      <AppointmentHistoryTable />
    </div>
  )
}
