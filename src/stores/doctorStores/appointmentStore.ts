// stores/appointmentStore.ts
import { create } from "zustand";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  patientName?: string;
  doctorName?: string;
  mode?: string;
  status?: string;
}

interface AppointmentStore {
  upcoming: Appointment[];
  history: Appointment[];
  loading: boolean;
  fetchAppointments: () => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  upcoming: [],
  history: [],
  loading: false,
  fetchAppointments: async () => {
    set({ loading: true });

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));

    // Dummy data, can replace with real fetch call
    const upcomingAppointments: Appointment[] = [];

    const historyAppointments: Appointment[] = [];

    set({
      upcoming: upcomingAppointments,
      history: historyAppointments,
      loading: false,
    });
  },
}));
