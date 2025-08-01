import { create } from "zustand";

interface Appointment {
  reason: any;
  status: "pending" | "approved" | "busy" | "cancelled";
  _id: string;
  user: {
    avatar: string;
    username: string;
    email: string;
    mode: string;
    status: string;
    time: string;
  };
  doctor: { name: string; specialty: string; rate: number; _id?: string };
  date: string;
}

interface AppointmentState {
  appointments: Appointment[] | null;
  approvedAppointments: Appointment[] | null;
  loading: boolean;
  error: string | null;
  fetchAppointmentsByDoctorId: (doctorId: string) => Promise<void>;
  fetchAllApprovedAppointmentsByDoctorId: (doctorId: string) => Promise<void>;
  fetchAppointmentsByPatientId: (patientId: string) => Promise<void>;
  approveAppointment: (appointmentId: string) => Promise<void>;
  markBusyAppointment: (appointmentId: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: null,
  approvedAppointments: null,
  loading: false,
  error: null,

  fetchAppointmentsByDoctorId: async (doctorId) => {
    if (!doctorId) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/doctorsApi/appointments/fetchapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch");
      }
      const data = await res.json();
      set({ appointments: data, loading: false, error: null });
    } catch (err: any) {
      set({
        error: err.message || "Unknown error",
        loading: false,
        appointments: null,
      });
    }
  },

  fetchAllApprovedAppointmentsByDoctorId: async (doctorId) => {
    if (!doctorId) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/doctorsApi/appointments/fetchapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, status: "approved" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch approved appointments");
      }
      const data = await res.json();
      set({ approvedAppointments: data, loading: false, error: null });
    } catch (err: any) {
      set({
        error: err.message || "Unknown error",
        loading: false,
        approvedAppointments: null,
      });
    }
  },

  fetchAppointmentsByPatientId: async (patientId) => {
    if (!patientId) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/patientsApi/appointments/fetchapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch");
      }
      const data = await res.json();
      set({ appointments: data, loading: false, error: null });
    } catch (err: any) {
      set({
        error: err.message || "Unknown error",
        loading: false,
        appointments: null,
      });
    }
  },

  approveAppointment: async (appointmentId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/doctorsApi/appointments/approveapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to approve appointment");
      }
      set((state) => {
        if (!state.appointments) return state;
        const updatedAppointments = state.appointments.map((app) =>
          app._id === appointmentId ? { ...app, status: "approved" as const } : app
        );
        return { appointments: updatedAppointments, loading: false, error: null };
      });
    } catch (err: any) {
      set({
        error: err.message || "Unknown error",
        loading: false,
      });
    }
  },

  markBusyAppointment: (appointmentId) => {
    set((state) => {
      if (!state.appointments) return state;
      const updatedAppointments = state.appointments.map((app) =>
        app._id === appointmentId ? { ...app, status: "busy" as const } : app
      );
      return { appointments: updatedAppointments };
    });
  },
}));