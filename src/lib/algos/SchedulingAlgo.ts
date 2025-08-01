import { Patient, ConsultationRoom } from "@/types/consultation";

interface SchedulingOptions {
  searchTerm?: string;
  filterStatus?: "all" | "scheduled" | "waiting" | "in-progress";
  currentDateTime?: Date;
}

export function scheduleConsultations(
  patients: Patient[],
  activeRooms: ConsultationRoom[],
  options: SchedulingOptions = {}
): { scheduledPatients: Patient[]; newRooms: ConsultationRoom[] } {
  const { searchTerm = "", filterStatus = "all", currentDateTime = new Date() } = options;

  // Filter patients based on search term and status
  const scheduledPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus;

    // Additional scheduling logic: prioritize based on priority and current date/time
    const appointmentDate = new Date(patient.appointmentTime);
    const isCurrent = appointmentDate.toDateString() === currentDateTime.toDateString();
    return matchesSearch && matchesStatus && isCurrent;
  });

  // Sort patients by priority (high > medium > low) and appointment time
  scheduledPatients.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime();
  });

  // Generate new consultation rooms for waiting patients
  const newRooms = [...activeRooms];
  scheduledPatients.forEach((patient) => {
    if (patient.status === "waiting" && !newRooms.some((room) => room.patientId === patient.id)) {
      const newRoom: ConsultationRoom = {
        id: `room-${Date.now()}-${patient.id}`,
        patientId: patient.id,
        patientName: patient.name,
        status: "waiting",
        startTime: currentDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        duration: "00:00",
      };
      newRooms.push(newRoom);
    }
  });

  return { scheduledPatients, newRooms };
}