import { Metadata } from "next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { toast } from "sonner";
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

  // 🔐 No token → redirect to login
  if (!token) {
    redirect("/Login");
  }

  try {
    // ⚠️ Decode first to check expiration manually
    const decodedToken: any = jwt.decode(token);

    // ⏳ Check if token is expired
    if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
      // toast.error("Session expired. Please log in again.");
      console.warn("Token expired");
      redirect("/Login");
    }

    // ✅ Now verify token integrity
    const verifiedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // ✅ Token matches current userId?
    const userId = params.userId;

    if (verifiedToken.id !== userId) {
      console.warn("User ID mismatch. Redirecting to their own dashboard.");
      redirect(`(dashboard)/user/${verifiedToken.id}/dashboard`);
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
  } catch (err) {
    console.error("Token verification failed:", err);
    redirect("/Login");
  }
}
