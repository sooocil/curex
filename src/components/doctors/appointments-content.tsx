"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Video, Phone, Calendar, Clock, User } from "lucide-react"

const upcomingAppointments = [
  {
    id: 1,
    patient: "John Smith",
    time: "09:00 AM",
    date: "Today",
    type: "Video Call",
    reason: "Follow-up consultation",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    time: "10:30 AM",
    date: "Today",
    type: "In-person",
    reason: "Initial consultation",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    patient: "Mike Wilson",
    time: "02:00 PM",
    date: "Tomorrow",
    type: "Phone Call",
    reason: "Prescription review",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const pastAppointments = [
  {
    id: 4,
    patient: "Emma Davis",
    time: "03:00 PM",
    date: "Yesterday",
    type: "Video Call",
    reason: "Routine checkup",
    status: "completed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    patient: "Robert Brown",
    time: "11:00 AM",
    date: "Dec 20, 2024",
    type: "In-person",
    reason: "Lab results review",
    status: "completed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function AppointmentsContent() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video Call":
        return <Video className="h-4 w-4" />
      case "Phone Call":
        return <Phone className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-curex hover:bg-curex/90">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
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
                      <h3 className="font-semibold">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time} - {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {getTypeIcon(appointment.type)}
                          <span className="ml-1">{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    {appointment.type === "Video Call" && (
                      <Button size="sm" className="bg-curex hover:bg-curex/90">
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    )}
                    {appointment.type === "Phone Call" && (
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
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
                      <h3 className="font-semibold">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time} - {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {getTypeIcon(appointment.type)}
                          <span className="ml-1">{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    <Button size="sm" variant="outline">
                      View Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
