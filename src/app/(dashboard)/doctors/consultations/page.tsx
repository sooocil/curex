import type { Metadata } from "next"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { ConsultationsContent } from "@/components/doctors/consultations-content"

export const metadata: Metadata = {
  title: "Consultations | Curex Doctor",
  description: "Active and past consultations",
}

export default async function DoctorConsultationsPage() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (err) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Consultations</h1>
      <ConsultationsContent />
    </div>
  )
}
