import { useEffect } from "react";
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
  fetchDoctors: () => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  setDoctors: (doctors: Doctor[]) => void;
};

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: [],
  isLoading: false,
  error: null,

  setDoctors: (doctors) => set({ doctors, error: null }),

  fetchDoctors: async () => {
    set({ isLoading: true, error: null });

    try {

        const res = await fetch("/api/doctorsApi/doctors/fetchdocs", {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        });

      if (!res.ok) {
        if (res.status === 401) window.location.href = "/login";
        throw new Error(`Fetch failed with status ${res.status}`);
      }

      const raw = await res.json();
      const doctors: Doctor[] = raw.map((doc: any) => ({
        id: doc._id,
        name: doc.name,
        specialty: doc.specialty,
        contact: doc.contact,
        rate: doc.rate,
        rating: doc.rating,
        reviews: doc.reviews,
        hospital: doc.hospital,
        location: doc.location,
        availability: doc.availability,
      }));

      set({ doctors, isLoading: false, error: null });
    } catch (err: unknown) {
      const error = err as Error;
      set({ isLoading: false, error: error.message || "Failed to fetch doctors" });
    }
  },

  deleteDoctor: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch("/api/doctorsApi/doctors/deletedocs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
 
      if (!res.ok) {
        if (res.status === 401) window.location.href = "/login";
        throw new Error(`Delete failed with status ${res.status}`);
      }

      const current = get().doctors;
      set({
        doctors: current.filter((doc) => doc.id !== id),
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const error = err as Error;
      set({ isLoading: false, error: error.message || "Failed to delete doctor" });
    }
  },
}));
