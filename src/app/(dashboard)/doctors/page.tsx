import type { Metadata } from "next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

import { DoctorOverview } from "@/components/doctors/doctor-overview";
import { TodayAppointments } from "@/components/doctors/today-appointments";
import { PatientStats } from "@/components/doctors/patient-stats";
import { RecentPatients } from "@/components/doctors/recent-patients";
import { ScheduleOverview } from "@/components/doctors/schedule-overview";


export const metadata: Metadata = {
  title: "Doctor Dashboard | Curex",
  description: "Curex doctor dashboard",
};

export default async function DoctorDashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/doctor/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      // Redirect or force logout
      redirect("/doctor/login");
      return;
    }

    // For other JWT errors
    console.error("Token verification error", err);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
      <DoctorOverview />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayAppointments />
        </div>
        <div>
          <ScheduleOverview />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <PatientStats />
        <RecentPatients />
      </div>
    </div>
  );
}
