import type { Metadata } from "next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { PatientsContent } from "@/components/doctors/patients-content";

export const metadata: Metadata = {
  title: "Patients | Curex Doctor",
  description: "Manage your patient records",
};

export default async function DoctorPatientsPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/doctor/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const doctorId = decoded.id;

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        <PatientsContent doctorId={doctorId} />
      </div>
    );
  } catch (err) {
    redirect("/doctor/login");
  }
}
