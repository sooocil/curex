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
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    async function load(filters = {}) {
      setLoading(true);
      setCurrentFilters(filters);
      await fetchApplications(filters);
      setLoading(false);
    }
    load();

    const handleRefresh = (event: Event) => {
      const customEvent = event as CustomEvent;
      load(customEvent.detail || {});
    };

    window.addEventListener("refresh-doctor-applications", handleRefresh);
    return () => {
      window.removeEventListener("refresh-doctor-applications", handleRefresh);
    };
  }, [fetchApplications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateApplicationStatus(id, newStatus);
    if (newStatus === "rejected") {
      const event = new CustomEvent("refresh-doctor-applications", {
        detail: currentFilters,
      });
      window.dispatchEvent(event);
    }
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
              <TableRow key={`loading-${index}`}>
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
                  {application.createdAt
                    ? new Date(application.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "-"}
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
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
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