"use client";

import { useTestStore } from "@/stores/useTestStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export function TestHistoryFilter() {
  const userId = useParams<{ userId: string }>().userId;
  const { search, setSearch, resultFilter, setResultFilter, dateFilter, setDateFilter } =
    useTestStore();

  // Local state to control checkbox groups (to behave like radio buttons)
  const [resultSelected, setResultSelected] = useState(resultFilter);
  const [dateSelected, setDateSelected] = useState(dateFilter);

  // Sync local to global on change
  useEffect(() => {
    setResultFilter(resultSelected);
  }, [resultSelected]);

  useEffect(() => {
    setDateFilter(dateSelected);
  }, [dateSelected]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Search tests..."
        className="sm:w-[250px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        <Button
          onClick={() => (window.location.href = `/Interview/${userId}/questions`)}
        >
          Take Test
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Filter by Result</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["All", "Normal", "Abnormal", "Low", "High"].map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={resultSelected === option}
              onCheckedChange={() => setResultSelected(option as any)}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["All Time", "Last Month", "Last 3 Months", "Last Year"].map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={dateSelected === option}
              onCheckedChange={() => setDateSelected(option as any)}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
