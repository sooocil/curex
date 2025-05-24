"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

export function TestHistoryFilter() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input placeholder="Search tests..." className="sm:w-[250px]" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm"  className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Filter by Result</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Normal</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Abnormal</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Low</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>High</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>All Time</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Last Month</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Last 3 Months</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Last Year</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
