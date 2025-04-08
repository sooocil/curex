"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const applications = [
  {
    id: "app-1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    hospital: "City General Hospital",
    location: "New York, NY",
    date: "2023-04-08",
    status: "pending",
  },
  {
    id: "app-2",
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    hospital: "Westside Medical Center",
    location: "Los Angeles, CA",
    date: "2023-04-07",
    status: "pending",
  },
  {
    id: "app-3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    hospital: "Children's Hospital",
    location: "Chicago, IL",
    date: "2023-04-06",
    status: "pending",
  },
  {
    id: "app-4",
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    hospital: "University Medical Center",
    location: "Boston, MA",
    date: "2023-04-05",
    status: "pending",
  },
  {
    id: "app-5",
    name: "Dr. Lisa Thompson",
    specialty: "Oncologist",
    hospital: "Cancer Treatment Center",
    location: "Houston, TX",
    date: "2023-04-04",
    status: "pending",
  },
]

export function DoctorApplicationsTable() {
  const [applicationData, setApplicationData] = useState(applications)

  const handleStatusChange = (id: string, newStatus: string) => {
    setApplicationData(applicationData.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "info_needed":
        return <Badge className="bg-blue-500">Info Needed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
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
            <TableHead className="hidden md:table-cell">Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicationData.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-curex/10 text-curex">
                      {application.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{application.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{application.specialty}</TableCell>
              <TableCell className="hidden md:table-cell">{application.hospital}</TableCell>
              <TableCell className="hidden md:table-cell">{application.location}</TableCell>
              <TableCell className="hidden md:table-cell">{application.date}</TableCell>
              <TableCell>{getStatusBadge(application.status)}</TableCell>
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
                      <Link href={`/dashboard/admin/doctor-applications/${application.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(application.id, "approved")}>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(application.id, "rejected")}>
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(application.id, "info_needed")}>
                      <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                      Request Info
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
