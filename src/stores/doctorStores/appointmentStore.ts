import axios from "axios";
import { create } from "zustand";

interface Appointment {
  id: string;
  patientName?: string;
  doctorName?: string;
  specialty?: string;
  date: string;
  mode?: string;
  status?: string;
  reason?: string;
  doctorRating?: number;
}

interface AppointmentStore {
  upcoming: Appointment[];
  history: Appointment[];
  loading: boolean;
  fetchAppointments: (userId: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  upcoming: [],
  history: [],
  loading: false,

  fetchAppointments: async (userId: string) => {
    console.log("Fetching appointments for userId:", userId);
    set({ loading: true });

    try {
      const response = await axios.post("/api/users/appointments/fetchapp", {
        userId,
      });
      console.log("API response received:", response);
      console.log("This is userId:", userId);

      const data = response.data;
      console.log("Raw API response:", data);

      if (Array.isArray(data)) {
        const appointments: Appointment[] = data.map((item: any) => {
          const mappedAppointment = {
            id: item._id || "unknown_id",
            patientName: item.user?.username || "Unknown Patient",
            doctorName: item.doctor?.name || "Unknown Doctor",
            specialty: item.doctor?.specialty || "Unknown Specialty",
            date: item.date || new Date().toISOString(),
            mode: item.mode || "Not specified",
            status: item.status || "Unknown",
            reason: item.reason || "No reason provided",
            doctorRating: item.doctor?.rate || undefined,
          };
          console.log("Mapped appointment:", mappedAppointment);
          return mappedAppointment;
        });

        const now = new Date();
        const upcoming = appointments.filter(
          (app) => new Date(app.date) >= now
        );
        const history = appointments.filter((app) => new Date(app.date) < now);

        console.log("Upcoming appointments:", upcoming);
        console.log("History appointments:", history);

        set({
          upcoming,
          history,
        });
      } else {
        set({
          upcoming: [],
          history: [],
        });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      set({
        upcoming: [],
        history: [],
      });
    } finally {
      set({ loading: false });
    }
  },
}));
