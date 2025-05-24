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
      const res = await fetch("/api/tests", {
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
          // Handle missing endpoint gracefully
          set({ tests: [], isLoading: false, error: "Test endpoint not found" });
          return;
        }
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      const data = await res.json();
      set({ tests: data.tests || [], isLoading: false, error: null });
    } catch (error: any) {
      console.error("Failed to fetch tests:", error.message);
      set({ isLoading: false, error: error.message });
    }
  },
}));