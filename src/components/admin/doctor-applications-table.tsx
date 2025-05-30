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
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useDocApplicationStore } from "@/stores/doctorStores/docApplicationStore";

export function DoctorApplicationsTable() {
  const { applications, fetchApplications, updateApplicationStatus } = useDocApplicationStore();
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    const load = async (filters = {}) => {
      setLoading(true);
      setCurrentFilters(filters);
      await fetchApplications(filters);
      setLoading(false);
    };
    load();
  }, [fetchApplications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!id) {
      console.error("No ID provided for status change");
      return;
    }
    await updateApplicationStatus(id, newStatus);
    await fetchApplications(currentFilters);
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
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : applications.length === 0 ? (
            <TableRow key="empty">
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No doctor applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id || `fallback-${application.name}`}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {application.name
                          ? application.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "N/A"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{application.name || "Unknown"}</p>
                  </div>
                </TableCell>
                <TableCell>{application.specialty || "N/A"}</TableCell>
                <TableCell className="hidden md:table-cell">{application.hospital || "N/A"}</TableCell>
                <TableCell className="hidden md:table-cell">{application.location || "N/A"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {application.createdAt
                    ? new Date(application.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Actions"
                        disabled={!application.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/doctor-applications/${application.id || ""}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => application.id && handleStatusChange(application.id, "approved")}
                        disabled={!application.id}
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => application.id && handleStatusChange(application.id, "rejected")}
                        disabled={!application.id}
                      >
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => application.id && handleStatusChange(application.id, "info_needed")}
                        disabled={!application.id}
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