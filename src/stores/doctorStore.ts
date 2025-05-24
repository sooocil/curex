import { create } from "zustand";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  contact: string;
  rate: number;
  rating: number;
  reviews: number;
  hospital: string;
  location: string;
  availability: string;
};

type DoctorState = {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;
  setDoctors: (doctors: Doctor[]) => void;
  addDoctor: (doctor: Doctor) => void;
  fetchDoctors: () => Promise<void>;
};

export const useDoctorStore = create<DoctorState>((set) => ({
  doctors: [],
  isLoading: false,
  error: null,
  setDoctors: (doctors) => set({ doctors, error: null }),
  addDoctor: (doctor) =>
    set((state) => ({
      doctors: [...state.doctors, doctor],
      error: null,
    })),

  fetchDoctors: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/doctors", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (res.status === 404) {
          set({
            doctors: [],
            isLoading: false,
            error: "Doctor endpoint not found",
          });
          return;
        }
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const doctorList = {
        doctors: [
          {
            id: "doc-1",
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            contact: "123-456-7890",
            rate: 50,
            rating: 4.5,
            reviews: 120,
            hospital: "City Hospital",
            location: "Downtown",
            availability: "Mon-Fri, 9 AM - 5 PM",
          },
          {
            id: "doc-2",
            name: "Dr. Michael Chen",
            specialty: "Dermatologist",
            contact: "987-654-3210",
            rate: 50,
            rating: 4.5,
            reviews: 120,
            hospital: "City Hospital",
            location: "Downtown",
            availability: "Mon-Fri, 9 AM - 5 PM",
          },
          {
            id: "doc-3",
            name: "Dr. Emily Rodriguez",
            specialty: "Pediatrician",
            contact: "555-555-5555",
            rate: 50,
            rating: 4.5,
            reviews: 120,
            hospital: "City Hospital",
            location: "Downtown",
            availability: "Mon-Fri, 9 AM - 5 PM",
          },
        ],
      };

      set({ doctors: doctorList.doctors, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  },
}));
