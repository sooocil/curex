import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const upcomingAppointments = [
  {
    id: "app-1",
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "2023-04-20",
    time: "10:00 AM",
  },
  {
    id: "app-2",
    doctor: "Dr. Michael Chen",
    specialty: "Dermatologist",
    date: "2023-04-25",
    time: "2:30 PM",
  },
  {
    id: "app-3",
    doctor: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    date: "2023-05-05",
    time: "9:15 AM",
  },
]

export function UpcomingAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled doctor appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-curex/10 text-curex">
                    {appointment.doctor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{appointment.doctor}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.specialty} • {appointment.date} • {appointment.time}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/appointments/${appointment.id}`}>Details</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="link" className="text-curex">
            <Link href="/dashboard/appointments">View all appointments</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
