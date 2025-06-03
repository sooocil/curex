// app/(doctor)/appointments/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { AppointmentsContent } from "@/components/doctors/appointments-content";

export const metadata: Metadata = {
  title: "Appointments | Curex Doctor",
  description: "Manage your patient appointments",
};

interface JWTPayload {
  doctorId: string;
  // any other fields you may have in token
}

export default async function DoctorAppointmentsPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/doctor/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;


    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <AppointmentsContent doctorId={decoded.id} />
      </div>
    );
  } catch (err) {
    redirect("/doctor/login");
  }
}
