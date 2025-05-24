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



export function DoctorsFilter() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input placeholder="Search doctors..." className="sm:w-[250px]" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Filter by Specialty</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Cardiologist</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Dermatologist</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Neurologist</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Pediatrician</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Oncologist</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>All Locations</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>New York, NY</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Los Angeles, CA</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Chicago, IL</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Boston, MA</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
