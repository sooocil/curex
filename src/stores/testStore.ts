import { create } from "zustand";

export type Test = {
  id: string;
  name: string;
  date: string;
  status: string;
  result: string;
  doctor: string;
};

type TestState = {
  tests: Test[];
  isLoading: boolean;
  error: string | null;
  setTests: (tests: Test[]) => void;
  addTest: (test: Test) => void;
  fetchTests: () => Promise<void>;
};

const dummyTests: Test[] = [
  {
    id: "1",
    name: "Blood Test",
    date: "2024-06-01",
    status: "Completed",
    result: "Normal",
    doctor: "Dr. Smith",
  },
  {
    id: "2",
    name: "X-Ray",
    date: "2024-06-03",
    status: "Pending",
    result: "",
    doctor: "Dr. Lee",
  },
  {
    id: "3",
    name: "MRI Scan",
    date: "2024-05-28",
    status: "Completed",
    result: "No issues detected",
    doctor: "Dr. Patel",
  },
];

export const useTestStore = create<TestState>((set) => ({
  tests: [],
  isLoading: false,
  error: null,
  setTests: (tests) => set({ tests, error: null }),
  addTest: (test) =>
    set((state) => ({
      tests: [...state.tests, test],
      error: null,
    })),
  fetchTests: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay and append dummy data
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ tests: dummyTests, isLoading: false, error: null });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
}));
