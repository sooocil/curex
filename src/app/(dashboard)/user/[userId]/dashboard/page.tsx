import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserOverview } from "@/components/dashboard/user-overview";
import { RecentTests } from "@/components/dashboard/recent-tests";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { HealthTips } from "@/components/dashboard/health-tips";

export const metadata: Metadata = {
  title: "Dashboard | Curex",
  description: "Curex patient dashboard",
};

export default async function DashboardPage({
  params,
}: {
  params: { userId: string };
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const userCookie = (await cookieStore).get("user")?.value;

  // No token or user cookie → redirect to login
  if (!token || !userCookie) {
    redirect("/Login");
  }

  let userId: string | undefined;
  try {
    const parsed = JSON.parse(decodeURIComponent(userCookie));
    userId = parsed._id;
  } catch (err) {
    console.error("Failed to parse user cookie:", err);
    redirect("/Login");
  }

  // User ID mismatch → redirect to correct dashboard
  if (userId !== params.userId) {
    redirect(`/user/${userId}/dashboard`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <UserOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentTests />
        <UpcomingAppointments uId={params.userId} />
      </div>
      <HealthTips />
    </div>
  );
}