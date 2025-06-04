import { Metadata } from "next";
import { cookies } from "next/headers";
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

export default async function DashboardPage({ params }: { params: { userId: string } }) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  // 🔐 No token → redirect
  if (!token) {
    redirect("/Login");
  }

  let decoded: any;
  try {
    // ✅ Verify token
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    // ❌ Invalid token → redirect
    redirect("/Login");
  }

  // ✅ Only now we access params
  const userId = params.userId;

  // Optional: Ensure token's userId matches param
  if (decoded.id !== userId) {
    redirect("/Login");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <UserOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentTests />
        <UpcomingAppointments uId={userId} />
      </div>
      <HealthTips />
    </div>
  );
}
