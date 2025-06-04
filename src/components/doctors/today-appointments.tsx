"use client";

import { useEffect, useState } from "react";
import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TodayAppointmentsProps {
  doctorId: string;
}

export function TodayAppointments({ doctorId }: TodayAppointmentsProps) {
  const { appointments, loading, fetchAppointmentsByDoctorId } = useAppointmentStore();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!doctorId) return;

    fetchAppointmentsByDoctorId(doctorId).then(() => {
      setShowSkeleton(false);
    });
  }, [doctorId, fetchAppointmentsByDoctorId]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  if (loading || showSkeleton) {
    return (
      <div className="p-4 bg-white rounded-xl shadow space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 items-center">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }
  console.log("Appointments:", appointments);
  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-center text-gray-700">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent's Appointments</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Date & Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((apt) => (
            <TableRow key={apt._id}>
              <TableCell>{apt.user.username || "Unknown"}</TableCell>
              <TableCell>{formatDateTime(apt.date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
