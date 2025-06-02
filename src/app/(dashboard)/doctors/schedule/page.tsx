import type { Metadata } from "next"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { ScheduleContent } from "@/components/doctors/schedule-content"

export const metadata: Metadata = {
  title: "Schedule | Curex Doctor",
  description: "Manage your schedule and availability",
}

export default async function DoctorSchedulePage() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  // if (!token) {
  //   redirect("/doctor/login")
  // }

  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET as string)
  } catch (err) {
    // redirect("/doctor/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
      <ScheduleContent />
    </div>
  )
}
