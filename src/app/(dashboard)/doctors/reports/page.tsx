import type { Metadata } from "next"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { ReportsContent } from "@/components/doctors/reports-content"

export const metadata: Metadata = {
  title: "Reports | Curex Doctor",
  description: "Analytics and performance reports",
}

export default async function DoctorReportsPage() {
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
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <ReportsContent />
    </div>
  )
}
