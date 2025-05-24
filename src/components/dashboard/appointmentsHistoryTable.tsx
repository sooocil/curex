"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye } from "lucide-react"

// Replace with your real data fetched via props or useEffect
const appointments = [
  {
    id: "apt-1",
    patientName: "Krishna Sharma",
    doctorName: "Dr. Ram Bahadur",
    date: "2025-05-22",
    mode: "online",
    status: "pending",
  },
  {
    id: "apt-2",
    patientName: "Hari Singh",
    doctorName: "Dr. Shreesh Shrestha",
    date: "2025-05-19",
    mode: "offline",
    status: "completed",
  },
]

export function AppointmentHistoryTable() {
  const [data] = useState(appointments)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-400">Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-500">Approved</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((apt) => (
            <TableRow key={apt.id}>
              <TableCell>{apt.patientName}</TableCell>
              <TableCell>{apt.doctorName}</TableCell>
              <TableCell>{apt.date}</TableCell>
              <TableCell className="capitalize">{apt.mode}</TableCell>
              <TableCell>{getStatusBadge(apt.status)}</TableCell>
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
                      <Link href={`/dashboard/appointments/${apt.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
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
