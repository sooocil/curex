import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Video, Phone } from "lucide-react"

const appointments = [
  {
    id: 1,
    patient: "John Smith",
    time: "09:00 AM",
    type: "Video Call",
    status: "upcoming",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "Follow-up consultation",
  },
  {
    id: 2,
    patient: "Emily Johnson",
    time: "10:30 AM",
    type: "In-person",
    status: "in-progress",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "Regular checkup",
  },
  {
    id: 3,
    patient: "Michael Brown",
    time: "02:00 PM",
    type: "Phone Call",
    status: "upcoming",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "Prescription review",
  },
  {
    id: 4,
    patient: "Sarah Davis",
    time: "03:30 PM",
    type: "Video Call",
    status: "upcoming",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "Symptom discussion",
  },
]

export function TodayAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Today's Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patient} />
                  <AvatarFallback>
                    {appointment.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{appointment.patient}</p>
                  <p className="text-sm text-gray-500">{appointment.reason}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{appointment.time}</span>
                    <Badge variant={appointment.status === "in-progress" ? "default" : "secondary"}>
                      {appointment.status === "in-progress" ? "In Progress" : "Upcoming"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {appointment.type === "Video Call" && (
                  <Button size="sm" className="bg-curex hover:bg-curex/90">
                    <Video className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                )}
                {appointment.type === "Phone Call" && (
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                )}
                {appointment.type === "In-person" && (
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
