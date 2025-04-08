"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react"

const doctors = [
  {
    id: "doc-1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    hospital: "City General Hospital",
    location: "New York, NY",
    rate: 120,
    availability: "Mon, Wed, Fri: 9AM-5PM",
  },
  {
    id: "doc-2",
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    hospital: "Westside Medical Center",
    location: "Los Angeles, CA",
    rate: 100,
    availability: "Tue, Thu: 10AM-6PM",
  },
  {
    id: "doc-3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    hospital: "Children's Hospital",
    location: "Chicago, IL",
    rate: 90,
    availability: "Mon-Fri: 8AM-4PM",
  },
  {
    id: "doc-4",
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    hospital: "University Medical Center",
    location: "Boston, MA",
    rate: 150,
    availability: "Wed, Fri: 11AM-7PM",
  },
  {
    id: "doc-5",
    name: "Dr. Lisa Thompson",
    specialty: "Oncologist",
    hospital: "Cancer Treatment Center",
    location: "Houston, TX",
    rate: 130,
    availability: "Mon, Thu: 9AM-3PM",
  },
]

export function DoctorsTable() {
  const [doctorData, setDoctorData] = useState(doctors)

  const handleDeleteDoctor = (id: string) => {
    setDoctorData(doctorData.filter((doc) => doc.id !== id))
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead className="hidden md:table-cell">Hospital</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead>Rate ($/min)</TableHead>
            <TableHead className="hidden lg:table-cell">Availability</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctorData.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-curex/10 text-curex">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{doctor.specialty}</TableCell>
              <TableCell className="hidden md:table-cell">{doctor.hospital}</TableCell>
              <TableCell className="hidden md:table-cell">{doctor.location}</TableCell>
              <TableCell>${doctor.rate}</TableCell>
              <TableCell className="hidden lg:table-cell">{doctor.availability}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/doctors/${doctor.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/doctors/${doctor.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteDoctor(doctor.id)}>
                      <Trash className="mr-2 h-4 w-4 text-red-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
