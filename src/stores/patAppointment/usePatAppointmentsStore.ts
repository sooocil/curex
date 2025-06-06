import { create } from "zustand";

interface Appointment {
  status: "pending" | "approved" | "busy" | "cancelled";
  _id: string;
  user: { username: string; email: string; mode: string; status: string; time: string };
  doctor: { name: string; specialty: string; rate: number };
  date: string;
}

interface AppointmentState {
  appointments: Appointment[] | null;
  loading: boolean;
  error: string | null;
  fetchAppointmentsByUserId: (userId: string) => Promise<void>;
}

export const usePatAppointmentStore = create<AppointmentState>((set) => ({
  appointments: null,
  loading: false,
  error: null,

  fetchAppointmentsByUserId: async (userId) => {
    if (!userId) return;

    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/users/fetchapp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
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
}));
