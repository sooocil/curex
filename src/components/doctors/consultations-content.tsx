"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  Video,
  Search,
  Filter,
  MoreVertical,
  User,
} from "lucide-react";
import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore";
import { scheduleConsultations } from "@/lib/algos/SchedulingAlgo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

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

interface ApprovedAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  pastOrUpcoming: "Past" | "Upcoming";
}

export default function DoctorConsultationPageContent({
  doctorId,
}: {
  doctorId: string;
}) {
  const router = useRouter();
  const {
    appointments,
    approvedAppointments,
    loading,
    fetchAppointmentsByDoctorId,
    fetchAllApprovedAppointmentsByDoctorId,
  } = useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "scheduled" | "waiting" | "in-progress"
  >("all");
  const [activeRooms, setActiveRooms] = useState<ConsultationRoom[]>([
    {
      id: "1",
      patientId: "6846aeeef1b239d6d09bc0d7",
      patientName: "Sita",
      status: "active",
      startTime: "2:30 PM",
      duration: "15:23",
    },
  ]);

  const handleStartConsultation = async (patientId: string) => {
    try {
      const patient = patients.find((p) => p.id === patientId);
      if (!patient) {
        alert("Patient not found");
        return;
      }

      const payload = {
        doctorId,
        patientId,
        patientName: patient.name,
      };

      const response = await axios.post(
        "/api/consultation/consultation-room/create",
        payload
      );

      const createdRoom = response.data.room;

      setActiveRooms((prev) => [...prev, createdRoom]);
      alert("Room created successfully");
    } catch (err: any) {
      console.error("API Error:", err);
      alert("Failed to create room, please try again.");
    }
  };

  const patients: Patient[] = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      const now = new Date("2025-08-01T08:33:00+05:45"); // Current time
      return [
        {
          id: "6846aeeef1b239d6d09bc0d7",
          name: "Sita",
          age: 42,
          gender: "Female",
          appointmentTime: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "waiting",
          symptoms: ["Fever", "Headache"],
          priority: "medium",
          avatar: undefined,
        },
        {
          id: "dummy2",
          name: "Anjali Verma",
          age: 35,
          gender: "Female",
          appointmentTime: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "scheduled",
          symptoms: ["Cough"],
          priority: "low",
          avatar: undefined,
        },
        {
          id: "dummy3",
          name: "Rahul Mehta",
          age: 28,
          gender: "Male",
          appointmentTime: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "in-progress",
          symptoms: ["Fatigue"],
          priority: "high",
          avatar: undefined,
        },
      ];
    }

    return appointments.map((app) => ({
      id: app._id,
      name: app.user.username,
      age: 30,
      gender: "Unknown",
      appointmentTime: new Date(app.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status:
        app.status === "approved"
          ? "scheduled"
          : app.status === "pending"
            ? "waiting"
            : app.status === "busy"
              ? "in-progress"
              : "completed",
      symptoms: app.reason ? [app.reason] : ["No symptoms provided"],
      priority:
        app.status === "busy"
          ? "high"
          : app.status === "approved"
            ? "medium"
            : "low",
      avatar: app.user.avatar,
      lastConsultation: undefined,
      consultationDuration: undefined,
    }));
  }, [appointments]);

  const approvedAppointmentsList: ApprovedAppointment[] = useMemo(
    () =>
      approvedAppointments?.map((app) => {
        const appDate = new Date(app.date);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Reset time for date comparison
        const isPast = appDate < currentDate;
        return {
          id: app._id,
          patientName: app.user.username,
          date: appDate.toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: appDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          pastOrUpcoming: isPast ? "Past" : "Upcoming",
        };
      }) || [],
    [approvedAppointments]
  );

  useEffect(() => {
    if (doctorId) {
      fetchAppointmentsByDoctorId(doctorId);
      fetchAllApprovedAppointmentsByDoctorId(doctorId);
    }
  }, [
    doctorId,
    fetchAppointmentsByDoctorId,
    fetchAllApprovedAppointmentsByDoctorId,
  ]);

  const { scheduledPatients: _, newRooms } = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return { scheduledPatients: patients, newRooms: activeRooms };
    }
    return scheduleConsultations(patients, activeRooms, {
      searchTerm,
      filterStatus,
      currentDateTime: new Date(),
    });
  }, [patients, activeRooms, searchTerm, filterStatus, appointments]);

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

  const getPastOrUpcomingColor = (status: "Past" | "Upcoming") => {
    switch (status) {
      case "Past":
        return "bg-gray-100 text-gray-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 sticky top-0 h-screen">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Dr. Portal</h2>
          <p className="text-sm text-gray-600">Consultation Dashboard</p>
        </div>
        <div className="mt-8 px-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Active Rooms
          </h3>
          <div className="space-y-2">
            {activeRooms.map((room) => (
              <Card key={room.id} className="bg-teal-50/50 p-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-md font-medium text-gray-800">
                      {room.patientName}
                    </p>
                    <p className="text-xs text-gray-600">{room.duration}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => joinRoom(room.id)}
                    className="text-teal-600 hover:bg-teal-100"
                  >
                    <Video className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
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
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                {patients.filter((p) => p.status === "waiting").length} Waiting
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeRooms.length} Active
              </Badge>
            </div>
          </div>
        </header>

        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(
                    value as "all" | "scheduled" | "waiting" | "in-progress"
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {loading ? (
            <div className="space-y-6">
              {/* Skeleton for Patient Cards */}
              <div className="grid gap-4">
                {[...Array(3)].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right space-y-2">
                            <div className="flex items-center space-x-2">
                              <Skeleton className="h-5 w-16 rounded-full" />
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Skeleton className="h-8 w-20 rounded-md" />
                              <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-5 w-24 rounded-md" />
                          <Skeleton className="h-5 w-20 rounded-md" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Skeleton for Approved Appointments Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-48" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-4 w-64" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Skeleton className="h-4 w-24" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-24" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-16" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-20" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(3)].map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Skeleton className="h-5 w-20 rounded-full" />
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : patients.length > 0 ? (
            <div className="grid gap-4">
              {patients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="p-6">
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
                            <Badge
                              className={getPriorityColor(patient.priority)}
                            >
                              {patient.priority}
                            </Badge>
                            <Badge className={getStatusColor(patient.status)}>
                              {patient.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => {
                                handleStartConsultation(patient.id);
                                const { newRooms } = scheduleConsultations(
                                  patients,
                                  activeRooms,
                                  {
                                    searchTerm,
                                    filterStatus,
                                    currentDateTime: new Date(),
                                  }
                                );
                                setActiveRooms(newRooms);
                              }}
                              className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                              <Video className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                            {patient.status === "in-progress" && (
                              <Button
                                onClick={() => joinRoom(`room-${patient.id}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
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
                          <Badge key={index} variant="outline">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <CardTitle className="text-lg mb-2">
                    No Appointments Found
                  </CardTitle>
                  <CardDescription>
                    No patients have made appointments with you yet. Check back
                    later.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>All Approved Appointments</CardTitle>
                  <CardDescription>
                    List of all approved appointments, past and upcoming.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {approvedAppointmentsList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedAppointmentsList.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell>{app.patientName}</TableCell>
                            <TableCell>{app.date}</TableCell>
                            <TableCell>{app.time}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 mr-2">
                                Approved
                              </Badge>
                              <Badge
                                className={getPastOrUpcomingColor(
                                  app.pastOrUpcoming
                                )}
                              >
                                {app.pastOrUpcoming}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-gray-600">
                      No approved appointments found.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   Users,
//   Clock,
//   Video,
//   Search,
//   Filter,
//   MoreVertical,
//   User,
// } from "lucide-react";
// import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore";
// import { scheduleConsultations } from "@/lib/algos/SchedulingAlgo";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import axios from "axios";

// interface Patient {
//   id: string;
//   name: string;
//   age: number;
//   gender: string;
//   appointmentTime: string;
//   status: "scheduled" | "waiting" | "in-progress" | "completed";
//   symptoms: string[];
//   priority: "low" | "medium" | "high";
//   avatar?: string;
//   lastConsultation?: string;
//   consultationDuration?: string;
// }

// interface ConsultationRoom {
//   id: string;
//   patientId: string;
//   patientName: string;
//   status: "active" | "waiting";
//   startTime: string;
//   duration: string;
// }

// interface ApprovedAppointment {
//   id: string;
//   patientName: string;
//   date: string;
//   time: string;
//   pastOrUpcoming: "Past" | "Upcoming";
// }

// const DUMMY_PATIENT_ID = "6846aeeef1b239d6d09bc0d7";

// export default function DoctorConsultationPageContent({
//   doctorId,
// }: {
//   doctorId: string;
// }) {
//   const router = useRouter();
//   const {
//     appointments,
//     approvedAppointments,
//     loading,
//     fetchAppointmentsByDoctorId,
//     fetchAllApprovedAppointmentsByDoctorId,
//   } = useAppointmentStore();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState<
//     "all" | "scheduled" | "waiting" | "in-progress"
//   >("all");
//   const [activeRooms, setActiveRooms] = useState<ConsultationRoom[]>([
//     {
//       id: "1",
//       patientId: "1",
//       patientName: "Sita",
//       status: "active",
//       startTime: "2:30 PM",
//       duration: "15:23",
//     },
//   ]);

//   const handleStartConsultation = async () => {
//     try {
//       const response = await axios.post(
//         "/api/consultation/consultation-room/create",
//         {
//           doctorId: doctorId,
//           patientId: DUMMY_PATIENT_ID,
//           startTime: new Date(),
//           endTime: new Date(Date.now() + 1000 * 60 * 15),
//         }
//       );
//       alert("Room created successfully");
//     } catch (err) {
//       console.error("Error creating consultation room", err);
//       alert("Failed to create room");
//     }
//   };

//   const patients: Patient[] = useMemo(
//     () =>
//       appointments?.map((app) => ({
//         id: app._id,
//         name: app.user.username,
//         age: 30,
//         gender: "Unknown",
//         appointmentTime: new Date(app.date).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         status:
//           app.status === "approved"
//             ? "scheduled"
//             : app.status === "pending"
//             ? "waiting"
//             : app.status === "busy"
//             ? "in-progress"
//             : "completed",
//         symptoms: app.reason ? [app.reason] : ["No symptoms provided"],
//         priority:
//           app.status === "busy" ? "high" : app.status === "approved" ? "medium" : "low",
//         avatar: app.user.avatar,
//         lastConsultation: undefined,
//         consultationDuration: undefined,
//       })) || [],
//     [appointments]
//   );

//   const approvedAppointmentsList: ApprovedAppointment[] = useMemo(
//     () =>
//       approvedAppointments?.map((app) => {
//         const appDate = new Date(app.date);
//         const currentDate = new Date();
//         currentDate.setHours(0, 0, 0, 0); // Reset time for date comparison
//         const isPast = appDate < currentDate;
//         return {
//           id: app._id,
//           patientName: app.user.username,
//           date: appDate.toLocaleDateString([], {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }),
//           time: appDate.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//           pastOrUpcoming: isPast ? "Past" : "Upcoming",
//         };
//       }) || [],
//     [approvedAppointments]
//   );

//   useEffect(() => {
//     if (doctorId) {
//       fetchAppointmentsByDoctorId(doctorId);
//       fetchAllApprovedAppointmentsByDoctorId(doctorId);
//     }
//   }, [
//     doctorId,
//     fetchAppointmentsByDoctorId,
//     fetchAllApprovedAppointmentsByDoctorId,
//   ]);

//   const { scheduledPatients, newRooms } = useMemo(() => {
//     return scheduleConsultations(patients, activeRooms, {
//       searchTerm,
//       filterStatus,
//       currentDateTime: new Date(),
//     });
//   }, [patients, activeRooms, searchTerm, filterStatus]);

//   const joinRoom = (roomId: string) => {
//     router.push(`/doctors/consultations/room/${roomId}`);
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-100 text-red-800";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800";
//       case "low":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "in-progress":
//         return "bg-blue-100 text-blue-800";
//       case "waiting":
//         return "bg-orange-100 text-orange-800";
//       case "scheduled":
//         return "bg-gray-100 text-gray-800";
//       case "completed":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPastOrUpcomingColor = (status: "Past" | "Upcoming") => {
//     switch (status) {
//       case "Past":
//         return "bg-gray-100 text-gray-800";
//       case "Upcoming":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <div className="w-64 bg-white shadow-sm border-r border-gray-200 sticky top-0 h-screen">
//         <div className="p-6">
//           <h2 className="text-xl font-bold text-gray-800">Dr. Portal</h2>
//           <p className="text-sm text-gray-600">Consultation Dashboard</p>
//         </div>
//         <div className="mt-8 px-6">
//           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//             Active Rooms
//           </h3>
//           <div className="space-y-2">
//             {activeRooms.map((room) => (
//               <Card key={room.id} className="bg-teal-50/50 p-3">
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <p className="text-md font-medium text-gray-800">{room.patientName}</p>
//                     <p className="text-xs text-gray-600">{room.duration}</p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => joinRoom(room.id)}
//                     className="text-teal-600 hover:bg-teal-100"
//                   >
//                     <Video className="w-5 h-5" />
//                   </Button>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col">
//         <header className="bg-white border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Patient Consultations</h1>
//               <p className="text-gray-600">Manage your scheduled appointments and consultations</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Badge variant="secondary" className="bg-teal-100 text-teal-800">
//                 {scheduledPatients.filter((p) => p.status === "waiting").length} Waiting
//               </Badge>
//               <Badge variant="secondary" className="bg-blue-100 text-blue-800">
//                 {activeRooms.length} Active
//               </Badge>
//             </div>
//           </div>
//         </header>

//         <div className="bg-white border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <Input
//                   type="text"
//                   placeholder="Search patients..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Select
//                 value={filterStatus}
//                 onValueChange={(value) =>
//                   setFilterStatus(value as "all" | "scheduled" | "waiting" | "in-progress")
//                 }
//               >
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="All Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="scheduled">Scheduled</SelectItem>
//                   <SelectItem value="waiting">Waiting</SelectItem>
//                   <SelectItem value="in-progress">In Progress</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <Button variant="ghost" className="flex items-center space-x-2">
//               <Filter className="w-4 h-4" />
//               <span>More Filters</span>
//             </Button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-auto p-6 space-y-6">
//           {loading ? (
//             <div className="space-y-6">
//               {/* Skeleton for Patient Cards */}
//               <div className="grid gap-4">
//                 {[...Array(3)].map((_, index) => (
//                   <Card key={index}>
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                           <Skeleton className="w-12 h-12 rounded-full" />
//                           <div className="space-y-2">
//                             <Skeleton className="h-5 w-32" />
//                             <Skeleton className="h-4 w-24" />
//                             <Skeleton className="h-4 w-40" />
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <div className="text-right space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <Skeleton className="h-5 w-16 rounded-full" />
//                               <Skeleton className="h-5 w-20 rounded-full" />
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <Skeleton className="h-8 w-20 rounded-md" />
//                               <Skeleton className="h-8 w-8 rounded-md" />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mt-4">
//                         <Skeleton className="h-4 w-32 mb-2" />
//                         <div className="flex flex-wrap gap-2">
//                           <Skeleton className="h-5 w-24 rounded-md" />
//                           <Skeleton className="h-5 w-20 rounded-md" />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//               {/* Skeleton for Approved Appointments Table */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>
//                     <Skeleton className="h-6 w-48" />
//                   </CardTitle>
//                   <CardDescription>
//                     <Skeleton className="h-4 w-64" />
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>
//                           <Skeleton className="h-4 w-24" />
//                         </TableHead>
//                         <TableHead>
//                           <Skeleton className="h-4 w-24" />
//                         </TableHead>
//                         <TableHead>
//                           <Skeleton className="h-4 w-16" />
//                         </TableHead>
//                         <TableHead>
//                           <Skeleton className="h-4 w-20" />
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {[...Array(3)].map((_, index) => (
//                         <TableRow key={index}>
//                           <TableCell>
//                             <Skeleton className="h-4 w-32" />
//                           </TableCell>
//                           <TableCell>
//                             <Skeleton className="h-4 w-28" />
//                           </TableCell>
//                           <TableCell>
//                             <Skeleton className="h-4 w-16" />
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex space-x-2">
//                               <Skeleton className="h-5 w-20 rounded-full" />
//                               <Skeleton className="h-5 w-20 rounded-full" />
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </CardContent>
//               </Card>
//             </div>
//           ) : scheduledPatients.length > 0 ? (
//             <div className="grid gap-4">
//               {scheduledPatients.map((patient) => (
//                 <Card key={patient.id}>
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
//                           {patient.avatar ? (
//                             <img
//                               src={patient.avatar}
//                               alt={patient.name}
//                               className="w-12 h-12 rounded-full"
//                             />
//                           ) : (
//                             <User className="w-6 h-6 text-gray-600" />
//                           )}
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
//                           <p className="text-sm text-gray-600">
//                             {patient.age} years old • {patient.gender}
//                           </p>
//                           <div className="flex items-center space-x-2 mt-1">
//                             <Clock className="w-4 h-4 text-gray-400" />
//                             <span className="text-sm text-gray-600">{patient.appointmentTime}</span>
//                             {patient.lastConsultation && (
//                               <>
//                                 <span className="text-gray-400">•</span>
//                                 <span className="text-sm text-gray-600">
//                                   Last: {patient.lastConsultation}
//                                 </span>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4">
//                         <div className="text-right">
//                           <div className="flex items-center space-x-2 mb-2">
//                             <Badge className={getPriorityColor(patient.priority)}>
//                               {patient.priority}
//                             </Badge>
//                             <Badge className={getStatusColor(patient.status)}>
//                               {patient.status}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             {patient.status === "waiting" && (
//                               <Button
//                                 onClick={() => {
//                                   handleStartConsultation();
//                                   const { newRooms } = scheduleConsultations(patients, activeRooms, {
//                                     searchTerm,
//                                     filterStatus,
//                                     currentDateTime: new Date(),
//                                   });
//                                   setActiveRooms(newRooms);
//                                 }}
//                                 className="bg-teal-600 hover:bg-teal-700 text-white"
//                               >
//                                 <Video className="w-4 h-4 mr-1" />
//                                 Start
//                               </Button>
//                             )}
//                             {patient.status === "in-progress" && (
//                               <Button
//                                 onClick={() => joinRoom(`room-${patient.id}`)}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white"
//                               >
//                                 <Video className="w-4 h-4 mr-1" />
//                                 Join
//                               </Button>
//                             )}
//                             <Button variant="ghost" size="icon">
//                               <MoreVertical className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="mt-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">Reported Symptoms:</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {patient.symptoms.map((symptom, index) => (
//                           <Badge key={index} variant="outline">
//                             {symptom}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <>
//               <Card>
//                 <CardContent className="p-8 text-center">
//                   <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <CardTitle className="text-lg mb-2">No Appointments Found</CardTitle>
//                   <CardDescription>
//                     No patients have made appointments with you yet. Check back later.
//                   </CardDescription>
//                 </CardContent>
//               </Card>
//               <Card className="mt-6">
//                 <CardHeader>
//                   <CardTitle>All Approved Appointments</CardTitle>
//                   <CardDescription>
//                     List of all approved appointments, past and upcoming.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {approvedAppointmentsList.length > 0 ? (
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Patient Name</TableHead>
//                           <TableHead>Date</TableHead>
//                           <TableHead>Time</TableHead>
//                           <TableHead>Status</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {approvedAppointmentsList.map((app) => (
//                           <TableRow key={app.id}>
//                             <TableCell>{app.patientName}</TableCell>
//                             <TableCell>{app.date}</TableCell>
//                             <TableCell>{app.time}</TableCell>
//                             <TableCell>
//                               <Badge className="bg-green-100 text-green-800 mr-2">Approved</Badge>
//                               <Badge className={getPastOrUpcomingColor(app.pastOrUpcoming)}>
//                                 {app.pastOrUpcoming}
//                               </Badge>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   ) : (
//                     <p className="text-center text-gray-600">No approved appointments found.</p>
//                   )}
//                 </CardContent>
//               </Card>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
