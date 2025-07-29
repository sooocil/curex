import { create } from "zustand";
import axios from "axios";

export interface PatientStats {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  bloodGlucose: number;
}

interface PatientStatsStore {
  stats: PatientStats;
  setStats: (stats: Partial<PatientStats>) => void;
  fetchStats: (userId: string) => Promise<void>;
  updateStats: (userId: string, updates: Partial<PatientStats>) => Promise<void>;
}

export const usePatientStatsStore = create<PatientStatsStore>((set, get) => ({
  stats: {
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    bloodGlucose: 95,
  },
  setStats: (stats) => set((state) => ({ stats: { ...state.stats, ...stats } })),
  fetchStats: async (userId) => {
    try {
      const res = await axios.get(`/api/patient-stats/${userId}`);
      set({ stats: res.data });
    } catch (error) {
      console.error("Failed to fetch patient stats", error);
    }
  },
  updateStats: async (userId, updates) => {
    try {
      const res = await axios.put(`/api/patient-stats/${userId}`, updates);
      set({ stats: res.data });
    } catch (error) {
      console.error("Failed to update patient stats", error);
    }
  },
}));
