"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
} from "lucide-react";

import {usePatientRoomStore} from "@/stores/usePatientRooms";
import { useAppointmentStore } from "@/stores/doctorStores/appointmentStore";

export default function PatientConsultationPage() {
  const router = useRouter();
  const { userId } = useParams();

  const { rooms, fetchRooms } = usePatientRoomStore();
  const { upcoming, fetchAppointments, loading } = useAppointmentStore();

  useEffect(() => {
    if (userId) {
      fetchRooms(userId as string);
      const interval = setInterval(() => fetchRooms(userId as string), 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAppointments(userId as string);
    }
  }, [userId, fetchAppointments]);

  const joinRoom = (roomId: string) => {
    router.push(`/user/${userId}/dashboard/consultation/room/${roomId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "waiting":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "in-progress":
        return <Video className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Patient Portal</h2>
          <p className="text-sm text-gray-600">Your Health Dashboard</p>
        </div>

        <nav className="mt-6 space-y-1 px-6">
          <a className="flex items-center px-3 py-2 bg-[#00AD9B]/10 text-[#00AD9B] rounded-md">
            <Video className="mr-3 h-5 w-5" />
            Consultations
          </a>
          <a className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md">
            <Calendar className="mr-3 h-5 w-5 text-gray-600" />
            Appointments
          </a>
          <a className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md">
            <FileText className="mr-3 h-5 w-5 text-gray-600" />
            Medical Records
          </a>
          <a className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md">
            <MessageSquare className="mr-3 h-5 w-5 text-gray-600" />
            Messages
          </a>
          <a className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md">
            <Settings className="mr-3 h-5 w-5 text-gray-600" />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Consultations
            </h1>
            <p className="text-gray-600">
              Join your scheduled video consultations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded hover:bg-gray-100 text-gray-600">
              <Bell />
            </button>
            <div className="w-8 h-8 bg-[#00AD9B] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Rooms */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Available Consultation Rooms
              </h2>
              {rooms.length > 0 ? (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room._id}
                      className="bg-white border rounded-lg shadow-sm p-6"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4 items-center">
                          <div className="w-16 h-16 bg-[#00AD9B]/10 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-[#00AD9B]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {room.doctorId.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {room.doctorId.specialty}
                            </p>
                            <div className="flex space-x-3 mt-2 text-sm text-gray-600">
                              <span>
                                <Clock className="inline h-4 w-4 mr-1" />
                                {room.startTime}
                              </span>
                              <span>{room.endTime}</span>
                              <span>{room.consultationType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(room.status)}
                            <span
                              className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                                room.status
                              )}`}
                            >
                              {room.status === "ready"
                                ? "Ready to Join"
                                : room.status}
                            </span>
                          </div>

                          {room.status === "ready" && (
                            <button
                              onClick={() => joinRoom(room.roomId)}
                              className="flex items-center px-4 py-2 bg-[#00AD9B] text-white rounded hover:bg-[#009688]"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Join Consultation
                            </button>
                          )}

                          {room._id && (
                            <p className="text-xs text-gray-500 mt-2">
                              Room Code: {room.roomId}
                            </p>
                          )}
                        </div>
                      </div>

                      {room.status === "ready" && (
                        <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg flex items-center space-x-2">
                          <CheckCircle className="text-green-600 w-5 h-5" />
                          <p className="text-sm text-green-800">
                            Your doctor is ready to see you.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
                  <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Active Consultation Rooms
                  </h3>
                  <p className="text-gray-600">
                    You don't have any active consultation rooms right now.
                  </p>
                </div>
              )}
            </section>

            {/* Upcoming Appointments */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Appointments
              </h2>
              {loading ? (
                <p className="text-gray-600">Loading appointments...</p>
              ) : upcoming.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcoming.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-white p-4 rounded-lg border shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-gray-900 font-medium">
                            {appointment.doctorName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {appointment.specialty}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(appointment.date).toLocaleString()}
                            {" • "}
                            {appointment.mode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Upcoming Appointments
                  </h3>
                  <p className="text-gray-600">
                    You don’t have any appointments scheduled.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
