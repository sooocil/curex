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
    const upcomingAppointments: Appointment[] = [
      {
        id: "app-1",
        doctor: "Dr. Ram Bahadur",
        specialty: "Cardiology",
        date: "2023-04-20",
        time: "10:00 AM",
      },
      {
        id: "app-2",
        doctor: "Dr. Shreesh Shrestha",
        specialty: "Dermatology",
        date: "2023-04-25",
        time: "2:30 PM",
      },
      {
        id: "app-3",
        doctor: "Dr. Sarita Rana",
        specialty: "Pediatrics",
        date: "2023-05-05",
        time: "9:15 AM",
      },
    ];

    const historyAppointments: Appointment[] = [
      {
        id: "app-2",
        doctor: "Dr. Shreesh Shrestha",
        specialty: "Dermatology",
        date: "2023-04-25",
        time: "2:30 PM",
      },
      {
        id: "app-3",
        doctor: "Dr. Sarita Rana",
        specialty: "Pediatrics",
        date: "2023-05-05",
        time: "9:15 AM",
      },
    ];

    set({
      upcoming: upcomingAppointments,
      history: historyAppointments,
      loading: false,
    });
  },
}));
