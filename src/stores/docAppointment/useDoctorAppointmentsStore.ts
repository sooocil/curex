import { create } from "zustand";

interface Appointment {
  status: "pending" | "approved" | "busy" | "cancelled";
  _id: string;
  user: { username: string; email: string ; mode: string; status: string; time: string };
  doctor: { name: string; specialty: string; rate: number };
  date: string;
  // Add more as needed
}

interface AppointmentState {
  appointments: Appointment[] | null;
  loading: boolean;
  error: string | null;
  fetchAppointmentsByDoctorId: (doctorId: string) => Promise<void>;

  approveAppointment: (appointmentId: string) => void;
  markBusyAppointment: (appointmentId: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: null,
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
      console.log("Fetched appointments:", data);
      set({ appointments: data, loading: false, error: null });
    } catch (err: any) {
      set({
        error: err.message || "Unknown error",
        loading: false,
        appointments: null,
      });
    }
  },

  approveAppointment: (appointmentId) => {
    set((state) => {
      if (!state.appointments) return state;

      const updatedAppointments = state.appointments.map((app) =>
        app._id === appointmentId 
          ? { ...app, status: "approved" as const } 
          : app
      );
      console.log("Updated appointments after approval:", updatedAppointments);

      return { appointments: updatedAppointments };
    });
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
