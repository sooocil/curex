import { create } from "zustand";
import axios from "axios";

interface Room {
  _id: string;
  roomId: string;
  doctorId: { name: string; specialty: string };
  startTime: string;
  endTime: string;
  status: string;
  consultationType: string;
}

interface PatientRoomStore {
  rooms: Room[];
  loading: boolean;
  fetchRooms: (userId: string) => Promise<void>;
}

export const usePatientRoomStore = create<PatientRoomStore>((set) => ({
  rooms: [],
  loading: false,
  fetchRooms: async (userId: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `/api/consultation/consultation-room/getPatient/${userId}`
      );
      set({ rooms: res.data });
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      set({ rooms: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
