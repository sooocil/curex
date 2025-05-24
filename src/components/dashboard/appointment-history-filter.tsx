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

export function AppointmentHistoryFilter() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input placeholder="Search by doctor or patient..." className="sm:w-[250px]" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Approved</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Cancelled</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Mode</DropdownMenuLabel>
          <DropdownMenuCheckboxItem>Online</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Offline</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
