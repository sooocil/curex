import type { Metadata } from "next"
import { DashboardStats } from "@/components/admin/admin-dashboard-stats"
import { RecentDoctorApplications } from "@/components/admin/recent-doctor-applications"
import { DoctorApprovalRate } from "@/components/admin/doctor-approval-rate"

export const metadata: Metadata = {
  title: "Admin Dashboard | Curex",
  description: "Curex admin dashboard for managing doctors and applications",
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <DashboardStats />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentDoctorApplications />
        <DoctorApprovalRate />
      </div>
    </div>
  )
}
