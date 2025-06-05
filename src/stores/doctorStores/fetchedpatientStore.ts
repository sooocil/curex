// stores/doctorStores/fetchedpatientStore.ts
import { create } from "zustand";

export interface FetchedPatient {
  _id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  lastvisit: string;
}

interface FetchedPatientState {
  patients: FetchedPatient[];
  loading: boolean;
  error: string | null;
  fetchPatientsByDoctorId: (doctorId: string) => Promise<void>;
}

export const useFetchedPatientStore = create<FetchedPatientState>((set) => ({
  patients: [],
  loading: false,
  error: null,

  fetchPatientsByDoctorId: async (doctorId: string) => {
    if (!doctorId) return;

    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/doctorsApi/appointments/fetchapp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: doctorId }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to fetch patients");
      }

      const data: FetchedPatient[] = await response.json();
      set({ patients: data, loading: false });
    } catch (error: any) {
      set({
        patients: [],
        loading: false,
        error: error.message || "An unexpected error occurred",
      });
    }
  },
}));
