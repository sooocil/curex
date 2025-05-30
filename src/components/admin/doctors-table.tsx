"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { useDoctorStore } from "@/stores/doctorStores/doctorStore";
import { toast, Toaster } from "react-hot-toast";

export function DoctorsTable() {
  const { doctors, isLoading, error, fetchDoctors, deleteDoctor } = useDoctorStore();

  useEffect(() => {
    if (!doctors.length && !isLoading) fetchDoctors();
  }, [doctors]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoctor(id);
      toast.success("Doctor deleted");
    } catch {
      
      toast.error("Failed to delete doctor");
    }
  };

  const validDoctors = doctors.filter((doctor) => {
    const isValid = !!doctor?.id;
    if (!isValid) console.warn("Invalid doctor:", doctor);
    return isValid;
  });

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
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : !validDoctors.length ? (
            <TableRow key="empty">
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No doctors available
              </TableCell>
            </TableRow>
          ) : (
            validDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-curex/10 text-curex">
                        {doctor.name ? doctor.name.split(" ").map((n) => n[0]).join("") : "N/A"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{doctor.name || "Unknown"}</p>
                  </div>
                </TableCell>
                <TableCell>{doctor.specialty || "N/A"}</TableCell>
                <TableCell className="hidden md:table-cell">{doctor.hospital || "N/A"}</TableCell>
                <TableCell className="hidden md:table-cell">{doctor.location || "N/A"}</TableCell>
                <TableCell>${doctor.rate || "N/A"}</TableCell>
                <TableCell className="hidden lg:table-cell">{doctor.availability || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/doctors/${doctor.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/doctors/${doctor.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(doctor.id)}>
                        <Trash className="mr-2 h-4 w-4 text-red-500" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Toaster/>
    </div>
  );
}