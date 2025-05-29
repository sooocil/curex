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
  date?: string;
}

interface DocApplicationStore {
  applications: DoctorApplication[];
  setApplications: (apps: DoctorApplication[]) => void;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
  fetchApplications: () => Promise<void>;
}

export const useDocApplicationStore = create<DocApplicationStore>((set) => ({
  applications: [],

  setApplications: (applications) => set({ applications }),

  updateApplicationStatus: async (id, status) => {
    try {
      const res = await fetch("/api/doctorsApi/docapplications/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update application status");
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? { ...app, status } : app
        ),
      }));
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  },

  fetchApplications: async () => {
    try {
      const res = await fetch("/api/doctorsApi/docapplications/fetchapp");
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      set({
        applications: Array.isArray(data.applications) ? data.applications : [],
      });
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  },
}));
