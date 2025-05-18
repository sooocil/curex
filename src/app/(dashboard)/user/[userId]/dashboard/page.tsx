import type { Metadata } from "next"
import { UserOverview } from "@/components/dashboard/user-overview"
import { RecentTests } from "@/components/dashboard/recent-tests"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { HealthTips } from "@/components/dashboard/health-tips"

export const metadata: Metadata = {
  title: "Dashboard | Curex",
  description: "Curex patient dashboard",
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <UserOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentTests />
        <UpcomingAppointments />
      </div>
      <HealthTips />
    </div>
  )
}
