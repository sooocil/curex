"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Video,
  Clock,
  User,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  Play,
} from "lucide-react"
import { useAppointmentStore } from "@/stores/doctorStores/appointmentStore"

interface ConsultationRoom {
  id: string
  doctorName: string
  doctorSpecialty: string
  appointmentTime: string
  status: "waiting" | "ready" | "in-progress" | "completed"
  estimatedDuration: string
  consultationType: string
  roomCode?: string
}

export default function PatientConsultationPage() {
  const router = useRouter()
  const { userId } = useParams()
  const { upcoming, fetchAppointments, loading } = useAppointmentStore()

  const [availableRooms] = useState<ConsultationRoom[]>([
    {
      id: "room-1",
      doctorName: "Dr. Michael Chen",
      doctorSpecialty: "Internal Medicine",
      appointmentTime: "2:30 PM",
      status: "ready",
      estimatedDuration: "30 minutes",
      consultationType: "Follow-up",
      roomCode: "MCH-2024",
    },
  ])

  useEffect(() => {
    if (userId) {
      fetchAppointments(userId as string)
    }
  }, [userId, fetchAppointments])

  const joinRoom = (roomId: string) => {
    router.push(`/user/${userId}/dashboard/consultation/room/${roomId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "waiting":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "in-progress":
        return <Video className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Patient Portal</h2>
          <p className="text-sm text-gray-600">Your Health Dashboard</p>
        </div>

        <nav className="mt-6">
          <div className="px-6 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</h3>
          </div>
          <div className="mt-2 space-y-1">
            <a
              href="#"
              className="bg-[#00AD9B]/10 text-[#00AD9B] group flex items-center px-6 py-2 text-sm font-medium"
            >
              <Video className="mr-3 h-5 w-5" />
              Consultations
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-gray-50 group flex items-center px-6 py-2 text-sm font-medium"
            >
              <Calendar className="mr-3 h-5 w-5" />
              Appointments
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-gray-50 group flex items-center px-6 py-2 text-sm font-medium"
            >
              <FileText className="mr-3 h-5 w-5" />
              Medical Records
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-gray-50 group flex items-center px-6 py-2 text-sm font-medium"
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Messages
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-gray-50 group flex items-center px-6 py-2 text-sm font-medium"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </a>
          </div>
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 px-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              Book Appointment
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              View Test Results
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              Prescription Refill
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Consultations</h1>
              <p className="text-gray-600">Join your scheduled video consultations</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-[#00AD9B] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Available Consultation Rooms */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Consultation Rooms</h2>
              {availableRooms.length > 0 ? (
                <div className="space-y-4">
                  {availableRooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-[#00AD9B]/10 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-[#00AD9B]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{room.doctorName}</h3>
                            <p className="text-sm text-gray-600">{room.doctorSpecialty}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{room.appointmentTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-600">{room.estimatedDuration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-600">{room.consultationType}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-3">
                            {getStatusIcon(room.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(room.status)}`}
                            >
                              {room.status === "ready" ? "Ready to Join" : room.status}
                            </span>
                          </div>
                          {room.status === "ready" && (
                            <button
                              onClick={() => joinRoom(room.id)}
                              className="flex items-center space-x-2 px-6 py-2 bg-[#00AD9B] text-white rounded-lg hover:bg-[#009688] transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              <span>Join Consultation</span>
                            </button>
                          )}
                          {room.roomCode && <p className="text-xs text-gray-500 mt-2">Room Code: {room.roomCode}</p>}
                        </div>
                      </div>

                      {room.status === "ready" && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-sm text-green-800">
                              Your doctor is ready to see you. Please join the consultation room when you're ready.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Consultation Rooms</h3>
                  <p className="text-gray-600">
                    You don't have any active consultation rooms at the moment. Check back when your appointment time
                    approaches.
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
              {loading ? (
                <div className="text-center text-gray-600">Loading appointments...</div>
              ) : upcoming.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcoming.map((appointment) => (
                    <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">{new Date(appointment.date).toLocaleDateString()}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{new Date(appointment.date).toLocaleTimeString()}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{appointment.mode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-600">
                    You don't have any upcoming appointments. Book a new appointment to get started.
                  </p>
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-800 mb-4">
                If you're having trouble joining your consultation or have technical issues, we're here to help.
              </p>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Contact Support
                </button>
                <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  Test Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}