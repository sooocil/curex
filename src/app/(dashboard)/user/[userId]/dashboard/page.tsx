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

interface DashboardPageProps {
  params: Promise<{ userId: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { userId } = await params; 
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const userCookie = (await cookieStore).get("user")?.value;

  if (!token || !userCookie) {
    redirect("/Login");
  }

  let parsedUserId: string | undefined;
  try {
    const parsed = JSON.parse(decodeURIComponent(userCookie));
    parsedUserId = parsed._id;
  } catch (err) {
    console.error("Failed to parse user cookie:", err);
    redirect("/Login");
  }

  if (parsedUserId !== userId) {
    redirect(`/user/${parsedUserId}/dashboard`);
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
};

export default DashboardPage;