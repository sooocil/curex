import type { Metadata } from "next"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { MedicalRecordsContent } from "@/components/doctors/medical-records-content"

export const metadata: Metadata = {
  title: "Medical Records | Curex Doctor",
  description: "Patient medical records and history",
}

export default async function DoctorMedicalRecordsPage() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  if (!token) {
    redirect("/doctor/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (err) {
    redirect("/doctor/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
      <MedicalRecordsContent />
    </div>
  )
}
