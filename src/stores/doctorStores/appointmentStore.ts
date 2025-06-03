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
      const response = await axios.post("/api/users/appointments/fetchapp", { userId });
      console.log("API response status:", response.status);
      console.log("Raw API response:", JSON.stringify(response.data, null, 2));

      const data = response.data;

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
        const upcoming = appointments.filter((app) => new Date(app.date) >= now);
        const history = appointments.filter((app) => new Date(app.date) < now);

        console.log("Upcoming appointments:", JSON.stringify(upcoming, null, 2));
        console.log("History appointments:", JSON.stringify(history, null, 2));

        set({ upcoming, history });
      } else {
        console.warn("API response is not an array:", JSON.stringify(data, null, 2));
        // Mock data for testing
        const mockAppointments: Appointment[] = [
          {
            id: "1",
            patientName: "John Doe",
            doctorName: "Dr. Smith",
            specialty: "Cardiology",
            date: "2025-06-10T14:30:00Z",
            mode: "video",
            status: "approved",
            reason: "Follow-up checkup",
            doctorRating: 4.5,
          },
          {
            id: "2",
            patientName: "Jane Roe",
            doctorName: "Dr. Brown",
            specialty: "Neurology",
            date: "2025-05-01T10:00:00Z",
            mode: "in-person",
            status: "completed",
            reason: "Initial consultation",
            doctorRating: 4.8,
          },
        ];

        const now = new Date();
        set({
          upcoming: mockAppointments.filter((app) => new Date(app.date) >= now),
          history: mockAppointments.filter((app) => new Date(app.date) < now),
        });
        console.log("Using mock data due to invalid API response");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Mock data on error
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          patientName: "John Doe",
          doctorName: "Dr. Smith",
          specialty: "Cardiology",
          date: "2025-06-10T14:30:00Z",
          mode: "video",
          status: "approved",
          reason: "Follow-up checkup",
          doctorRating: 4.5,
        },
        {
          id: "2",
          patientName: "Jane Roe",
          doctorName: "Dr. Brown",
          specialty: "Neurology",
          date: "2025-05-01T10:00:00Z",
          mode: "in-person",
          status: "completed",
          reason: "Initial consultation",
          doctorRating: 4.8,
        },
      ];
      const now = new Date();
      set({
        upcoming: mockAppointments.filter((app) => new Date(app.date) >= now),
        history: mockAppointments.filter((app) => new Date(app.date) < now),
      });
      console.log("Using mock data due to error");
    } finally {
      set({ loading: false });
    }
  },
}));
