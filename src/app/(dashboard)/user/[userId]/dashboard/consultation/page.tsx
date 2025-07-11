import type { Metadata } from "next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { PatientConsultationsContent } from "@/components/dashboard/consultations-content";

export const metadata: Metadata = {
  title: "Consultations | Curex Doctor",
  description: "Active and past consultations",
};

export default async function PatientConsultationsPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  try {
    

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as unknown as { id: string };
    const userId = decoded.id;

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Consultations</h1>
        <PatientConsultationsContent />
      </div>
    );
  } catch (err) {
    redirect("/Login");
  }
}
