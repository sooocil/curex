import { create } from "zustand";

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Documents {
  medicalLicense?: string;
  boardCertification?: string;
  hospitalPrivileges?: string;
}

export interface DoctorApplication {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  specialty: string;
  hospital: string;
  location: string;
  rate: number;
  availability: string;
  bio: string;
  education: Education[];
  certifications: Certification[];
  documents: Documents;
  status?: string;
  createdAt?: string;
}

interface DocApplicationStore {
  applications: DoctorApplication[];
  setApplications: (apps: DoctorApplication[]) => void;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
  fetchApplications: (filters?: {
    search?: string;
    status?: string | null;
    date?: string | null;
  }) => Promise<void>;
}

export const useDocApplicationStore = create<DocApplicationStore>((set) => ({
  applications: [],

  setApplications: (applications) => set({ applications }),

  updateApplicationStatus: async (id, status) => {
    if (!id || !status) {
      console.error("Invalid id or status provided");
      return;
    }

    try {
      const res = await fetch("/api/doctorsApi/docapplications/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update application status");
      }

      const { application } = await res.json();
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? { ...app, status: application.status } : app
        ),
      }));
    } catch (error: any) {
      console.error("Failed to update application status:", error.message);
    }
  },

  fetchApplications: async (filters = {}) => {
    try {
      const query = new URLSearchParams();
      if (filters.search) query.append("search", filters.search);
      if (filters.status && filters.status !== "all") query.append("status", filters.status);
      if (filters.date && filters.date !== "all") query.append("date", filters.date);

      const res = await fetch(`/api/doctorsApi/docapplications/fetchapp?${query.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch applications");
      }
      const data = await res.json();
      set({
        applications: Array.isArray(data.applications) ? data.applications : [],
      });
    } catch (error: any) {
      console.error("Failed to fetch applications:", error.message);
    }
  },
}));