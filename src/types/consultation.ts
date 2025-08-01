export interface Patient {
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

export interface ConsultationRoom {
  id: string;
  patientId: string;
  patientName: string;
  status: "active" | "waiting";
  startTime: string;
  duration: string;
}