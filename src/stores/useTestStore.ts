import { toast } from "sonner";
import { create } from "zustand";

export type Test = {
  id: string;
  name: string;
  date: string; // ISO string or date string
  result: string;
  doctor: string;
};

type DateFilterOption = "All Time" | "Last Month" | "Last 3 Months" | "Last Year";
type ResultFilterOption = "All" | "Normal" | "Low" | "High" | "Abnormal";

type TestState = {
  tests: Test[];
  filteredTests: Test[];
  isLoading: boolean;
  error: string | null;

  // Filters
  search: string;
  resultFilter: ResultFilterOption;
  dateFilter: DateFilterOption;

  // Actions
  setTests: (tests: Test[]) => void;
  fetchTests: (userId: string) => Promise<void>;

  setSearch: (search: string) => void;
  setResultFilter: (filter: ResultFilterOption) => void;
  setDateFilter: (filter: DateFilterOption) => void;

  applyFilters: () => void;

  deleteTest: (id: string, userId: string) => Promise<void>;
};

function filterByDate(tests: Test[], filter: DateFilterOption) {
  if (filter === "All Time") return tests;

  const now = new Date();
  const cutoffDate = new Date();

  switch (filter) {
    case "Last Month":
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case "Last 3 Months":
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    case "Last Year":
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return tests;
  }

  return tests.filter((test) => new Date(test.date) >= cutoffDate);
}

export const useTestStore = create<TestState>((set, get) => ({
  tests: [],
  filteredTests: [],
  isLoading: false,
  error: null,

  search: "",
  resultFilter: "All",
  dateFilter: "All Time",

  setTests: (tests) => {
    set({ tests });
    get().applyFilters();
  },

  fetchTests: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/symptom-assessment/fetchbyId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      if (!res.ok) {
        set({ isLoading: false, error: `Failed to fetch tests: ${res.status}` });
        return;
      }

      const fetchedTests = await res.json();

      if (!Array.isArray(fetchedTests)) {
        set({ isLoading: false, error: "Invalid response format" });
        return;
      }

      set({ tests: fetchedTests, isLoading: false, error: null });
      get().applyFilters();
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "Unknown error occurred" });
    }
  },

  setSearch: (search) => {
    set({ search });
    get().applyFilters();
  },

  setResultFilter: (resultFilter) => {
    set({ resultFilter });
    get().applyFilters();
  },

  setDateFilter: (dateFilter) => {
    set({ dateFilter });
    get().applyFilters();
  },

  applyFilters: () => {
    const { tests, search, resultFilter, dateFilter } = get();

    let filtered = [...tests];

    // Filter by search (case-insensitive)
    if (search.trim()) {
      filtered = filtered.filter((test) =>
        test.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by result
    if (resultFilter !== "All") {
      filtered = filtered.filter((test) => test.result === resultFilter);
    }

    // Filter by date
    filtered = filterByDate(filtered, dateFilter);

    set({ filteredTests: filtered });
  },

  deleteTest: async (id, userId) => {
    try {
      const res = await fetch(`/api/symptom-assessment/delete?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete test");
      }

      toast.success("Test deleted successfully.");
      await get().fetchTests(userId);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again later.");
    }
  },
}));
