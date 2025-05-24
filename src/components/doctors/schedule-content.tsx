"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react"

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const appointments = {
  "Mon-10:00": { patient: "John Smith", type: "Video Call" },
  "Mon-14:30": { patient: "Sarah Johnson", type: "In-person" },
  "Tue-09:30": { patient: "Mike Wilson", type: "Phone Call" },
  "Wed-11:00": { patient: "Emma Davis", type: "Video Call" },
  "Thu-15:00": { patient: "Robert Brown", type: "In-person" },
  "Fri-10:30": { patient: "Lisa White", type: "Video Call" },
}

export function ScheduleContent() {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const getWeekDates = (date: Date) => {
    const week = []
    const startDate = new Date(date)
    const day = startDate.getDay()
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1)
    startDate.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startDate)
      weekDate.setDate(startDate.getDate() + i)
      week.push(weekDate)
    }
    return week
  }

  const weekDates = getWeekDates(currentWeek)

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const getAppointmentKey = (dayIndex: number, time: string) => {
    return `${weekDays[dayIndex]}-${time}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} -{" "}
            {weekDates[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button className="bg-curex hover:bg-curex/90">
          <Plus className="h-4 w-4 mr-2" />
          Block Time
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            <div className="p-4 border-r">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            {weekDays.map((day, index) => (
              <div key={day} className="p-4 text-center border-r last:border-r-0">
                <div className="font-medium">{day}</div>
                <div className="text-sm text-gray-500">{weekDates[index].getDate()}</div>
              </div>
            ))}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b last:border-b-0">
                <div className="p-3 border-r text-sm text-gray-500 bg-gray-50">{time}</div>
                {weekDays.map((day, dayIndex) => {
                  const appointmentKey = getAppointmentKey(dayIndex, time)
                  const appointment = appointments[appointmentKey as keyof typeof appointments]

                  return (
                    <div key={`${day}-${time}`} className="p-2 border-r last:border-r-0 min-h-[60px]">
                      {appointment ? (
                        <div className="bg-curex/10 border border-curex/20 rounded p-2 text-xs">
                          <div className="font-medium text-curex">{appointment.patient}</div>
                          <div className="text-gray-600">{appointment.type}</div>
                        </div>
                      ) : (
                        <div className="h-full hover:bg-gray-50 rounded cursor-pointer" />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Appointments</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Available Slots</span>
                <Badge variant="outline">4</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Blocked Time</span>
                <Badge variant="destructive">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Hours</span>
                <span className="font-medium">42h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Booked Hours</span>
                <span className="font-medium">28h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Utilization</span>
                <span className="font-medium text-curex">67%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Set Availability
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Block Time Off
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Recurring Slots
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
