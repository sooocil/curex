"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useDocApplicationStore } from "@/stores/doctorStores/docApplicationStore";

export function DoctorApplicationsTable() {
  const { applications, fetchApplications, updateApplicationStatus } = useDocApplicationStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await fetchApplications();
      setLoading(false);
    }
    load();
  }, [fetchApplications]);

  const handleStatusChange = (id: string, newStatus: string) => {
    updateApplicationStatus(id, newStatus);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "info_needed":
        return <Badge className="bg-blue-500">Info Needed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

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
          {loading ? (
            <TableRow key="loading">
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                Loading applications...
              </TableCell>
            </TableRow>
          ) : applications.length === 0 ? (
            <TableRow key="empty">
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No doctor applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application, index) => (
              <TableRow key={application.id || `fallback-${index}`}>
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
                <TableCell className="hidden md:table-cell">
                  {application.hospital}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {application.location}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {application.date || "-"}
                </TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="Actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/doctor-applications/${application.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(application.id, "approved")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green condensing-500" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(application.id, "rejected")}
                      >
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(application.id, "info_needed")}
                      >
                        <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                        Request Info
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}