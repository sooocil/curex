import { Metadata } from "next";
import { cookies } from "next/headers"; // To read cookies in server component
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

import { UserOverview } from "@/components/dashboard/user-overview";
import { RecentTests } from "@/components/dashboard/recent-tests";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { HealthTips } from "@/components/dashboard/health-tips";

export const metadata: Metadata = {
  title: "Dashboard | Curex",
  description: "Curex patient dashboard",
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/Login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // You can use decoded info (user id, email, etc.) if needed here

  } catch (err) {
    // Invalid token or verification failed
    redirect("/Login");
  }

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
  );
}
