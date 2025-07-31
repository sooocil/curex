"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Users,
  Calendar,
  Clock,
  Video,
  Search,
  Filter,
  MoreVertical,
  User,
  MessageSquare,
} from "lucide-react";
import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
  status: "scheduled" | "waiting" | "in-progress" | "completed";
  symptoms: string[];
  priority: "low" | "medium" | "high";
  avatar?: string;
  lastConsultation?: string;
  consultationDuration?: string;
}

interface ConsultationRoom {
  id: string;
  patientId: string;
  patientName: string;
  status: "active" | "waiting";
  startTime: string;
  duration: string;
}

export default function DoctorConsultationPageContent({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const { appointments, loading, fetchAppointmentsByDoctorId } = useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "scheduled" | "waiting" | "in-progress"
  >("all");

  const [activeRooms, setActiveRooms] = useState<ConsultationRoom[]>([
    {
      id: "1",
      patientId: "1",
      patientName: "Sita",
      status: "active",
      startTime: "2:30 PM",
      duration: "15:23",
    },
  ]);

  const patients: Patient[] = appointments
    ?.map((app) => ({
      id: app._id,
      name: app.user.username,
      age: 30,
      gender: "Unknown",
      appointmentTime: new Date(app.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: app.status === "approved" ? "scheduled" : app.status === "pending" ? "waiting" : app.status === "busy" ? "in-progress" : "completed",
      symptoms: app.reason ? [app.reason] : ["No symptoms provided"],
      priority: app.status === "busy" ? "high" : app.status === "approved" ? "medium" : "low",
      avatar: app.user.avatar,
      lastConsultation: undefined,
      consultationDuration: undefined,
    })) || [];

  useEffect(() => {
    if (doctorId) {
      fetchAppointmentsByDoctorId(doctorId as string);
    }
  }, [doctorId, fetchAppointmentsByDoctorId]);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const createRoom = (patient: Patient) => {
    const newRoom: ConsultationRoom = {
      id: `room-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      status: "waiting",
      startTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: "00:00",
    };
    setActiveRooms([...activeRooms, newRoom]);
  };

  const joinRoom = (roomId: string) => {
    router.push(`/doctors/consultations/room/${roomId}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "waiting":
        return "bg-orange-100 text-orange-800";
      case "scheduled":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 sticky">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Dr. Portal</h2>
          <p className="text-sm text-gray-600">Consultation Dashboard</p>
        </div>

        <div className="mt-8 px-6 fixed ">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Active Rooms
          </h3>
          <div className="space-y-2 ">
            {activeRooms.map((room) => (
              <div key={room.id} className="bg-[#00AD9B]/5 rounded-lg p-3">
                <div className="flex items-center justify-between gap-10">
                  <div>
                    <p className="text-md font-medium text-gray-800">
                      {room.patientName}
                    </p>
                    <p className="text-xs text-gray-600">{room.duration}</p>
                  </div>
                  <button
                    onClick={() => joinRoom(room.id)}
                    className="p-1 text-[#00AD9B] hover:bg-[#00AD9B]/10 rounded"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Patient Consultations
              </h1>
              <p className="text-gray-600">
                Manage your scheduled appointments and consultations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-[#00AD9B]/10 text-[#00AD9B] px-3 py-1 rounded-full text-sm font-medium">
                {filteredPatients.filter((p) => p.status === "waiting").length}{" "}
                Waiting
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {activeRooms.length} Active
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AD9B] focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AD9B] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="waiting">Waiting</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center text-gray-600">Loading appointments...</div>
          ) : patients.length > 0 ? (
            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {patient.age} years old • {patient.gender}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {patient.appointmentTime}
                          </span>
                          {patient.lastConsultation && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">
                                Last: {patient.lastConsultation}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(patient.priority)}`}
                          >
                            {patient.priority}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}
                          >
                            {patient.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {patient.status === "waiting" && (
                            <button
                              onClick={() => createRoom(patient)}
                              className="flex items-center space-x-1 px-3 py-1 bg-[#00AD9B] text-white rounded-lg hover:bg-[#009688] transition-colors text-sm"
                            >
                              <Video className="w-4 h-4" />
                              <span>Start</span>
                            </button>
                          )}
                          {patient.status === "in-progress" && (
                            <button
                              onClick={() => joinRoom("room-1")}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              <Video className="w-4 h-4" />
                              <span>Join</span>
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Reported Symptoms:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Appointments Found
              </h3>
              <p className="text-gray-600">
                No patients have made appointments with you yet. Check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
