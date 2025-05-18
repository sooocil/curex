'use client';

import type { Metadata } from "next"
import { TestHistoryTable } from "@/components/dashboard/test-history-table"
import { TestHistoryFilter } from "@/components/dashboard/test-history-filter"

export const metadata: Metadata = {
  title: "Test History | Curex",
  description: "View your test history",
}

export default function TestHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Test History</h1>
        <TestHistoryFilter />
      </div>
      <TestHistoryTable />
    </div>
  )
}
