"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Phone, MessageSquare, Clock, FileText, Calendar } from "lucide-react"
import { usePatAppointmentStore } from "@/stores/patAppointment/usePatAppointmentsStore"

interface PatientConsultationsContentProps {
  userId: string
}

export function PatientConsultationsContent({ userId }: PatientConsultationsContentProps) {
  const { fetchAppointmentsByUserId, appointments, loading, error } = usePatAppointmentStore()

  const [chatOpen, setChatOpen] = useState({
    isOpen: false,
    consultation: null as any,
  })
  const [videoCallOpen, setVideoCallOpen] = useState({
    isOpen: false,
    consultation: null as any,
  })

  useEffect(() => {
    if (userId) {
      fetchAppointmentsByUserId(userId)
    }
  }, [userId, fetchAppointmentsByUserId])

  // Transform appointments data for consultations
  const transformAppointmentToConsultation = (appointment: any) => ({
    id: appointment._id,
    doctorName: appointment.doctor?.name || "Dr. Unknown",
    doctorSpecialty: appointment.doctor?.specialty || "General Medicine",
    type: appointment.user?.mode || "Video Call",
    duration: "30m", // Default duration
    status: appointment.status === "approved" ? "Scheduled" : appointment.status,
    appointmentTime: new Date(appointment.date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    appointmentDate: new Date(appointment.date).toLocaleDateString(),
    avatar: "/placeholder.svg?height=40&width=40",
    reason: appointment.reason || "General consultation",
  })

  // Filter appointments for active consultations (today's approved appointments)
  const today = new Date()
  const activeConsultations = (appointments || [])
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return appointment.status === "approved" && appointmentDate.toDateString() === today.toDateString()
    })
    .map(transformAppointmentToConsultation)

  // Filter for recent consultations (past appointments)
  const recentConsultations = (appointments || [])
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return appointment.status === "approved" && appointmentDate < today
    })
    .map((appointment) => ({
      ...transformAppointmentToConsultation(appointment),
      status: "Completed",
      endTime: new Date(appointment.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      notes: "Consultation completed successfully",
    }))
    .slice(0, 5) // Show only last 5

  // Calculate stats from appointments
  const todayStats = {
    total: activeConsultations.length,
    videoCalls: activeConsultations.filter((c) => c.type === "Video Call").length,
    phoneCalls: activeConsultations.filter((c) => c.type === "Phone Call").length,
    totalDuration: `${activeConsultations.length * 30}m`, // Estimated
  }

  const weeklyStats = {
    consultations: (appointments || []).filter((app) => {
      const appointmentDate = new Date(app.date)
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      return appointmentDate >= weekAgo && app.status === "approved"
    }).length,
    avgDuration: "25m",
    satisfaction: "4.7/5",
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Error loading consultations: {error}</p>
            <Button onClick={() => fetchAppointmentsByUserId(userId)} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Consultations */}
      {activeConsultations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Consultations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between p-4 bg-curex/5 rounded-lg border border-curex/20"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={consultation.avatar || "/placeholder.svg"} alt={consultation.doctorName} />
                    <AvatarFallback>
                      {consultation.doctorName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{consultation.doctorName}</h3>
                    <p className="text-sm text-gray-600">{consultation.doctorSpecialty}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        {consultation.type === "Video Call" ? (
                          <Video className="h-4 w-4 mr-1" />
                        ) : (
                          <Phone className="h-4 w-4 mr-1" />
                        )}
                        {consultation.type}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {consultation.appointmentTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800">{consultation.status}</Badge>
                  <Button
                    onClick={() => setVideoCallOpen({ isOpen: true, consultation })}
                    size="sm"
                    className="bg-curex hover:bg-curex/90"
                  >
                    Join Call
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setChatOpen({ isOpen: true, consultation })}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations today</h3>
            <p className="text-gray-600 mb-4">You don't have any scheduled consultations for today.</p>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Consultations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Consultations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentConsultations.length > 0 ? (
            recentConsultations.map((consultation) => (
              <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={consultation.avatar || "/placeholder.svg"} alt={consultation.doctorName} />
                    <AvatarFallback>
                      {consultation.doctorName
                        .split(" ")
                        .map((n:string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{consultation.doctorName}</h3>
                    <p className="text-sm text-gray-600">{consultation.doctorSpecialty}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        {consultation.type === "Video Call" ? (
                          <Video className="h-4 w-4 mr-1" />
                        ) : (
                          <Phone className="h-4 w-4 mr-1" />
                        )}
                        {consultation.type}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {consultation.duration}
                      </div>
                    </div>
                    {consultation.notes && <p className="text-sm text-gray-600 mt-1">{consultation.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-sm font-medium">{consultation.appointmentDate}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{consultation.status}</Badge>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Notes
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No recent consultations found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Consultations</span>
              <span className="font-medium">{todayStats.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Video Calls</span>
              <span className="font-medium">{todayStats.videoCalls}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Calls</span>
              <span className="font-medium">{todayStats.phoneCalls}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Duration</span>
              <span className="font-medium">{todayStats.totalDuration}</span>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Consultations</span>
              <span className="font-medium">{weeklyStats.consultations}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Duration</span>
              <span className="font-medium">{weeklyStats.avgDuration}</span>
            </div>
            <div className="flex justify-between">
              <span>Satisfaction</span>
              <span className="font-medium text-curex">{weeklyStats.satisfaction}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Book Consultation
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Doctor
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              View Records
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
