// stores/testStore.ts
import { create } from "zustand"

export type Test = {
  id: string
  name: string
  date: string
  status: string
  result: string
  doctor: string
}

type TestState = {
  tests: Test[]
  setTests: (tests: Test[]) => void
  addTest: (test: Test) => void
}

export const useTestStore = create<TestState>((set) => ({
  tests: [],
  setTests: (tests) => set({ tests }),
  addTest: (test) =>
    set((state) => ({
      tests: [...state.tests, test],
    })),
}))
