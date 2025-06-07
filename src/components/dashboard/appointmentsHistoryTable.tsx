"use client";

import { useEffect, useState, useMemo, useCallback, JSX } from "react";
import { useRouter } from "next/navigation";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useAppointmentStore } from "@/stores/doctorStores/appointmentStore";
import { Skeleton } from "@/components/ui/skeleton";

interface Appointment {
  id: string;
  patientName?: string;
  doctorName?: string;
  specialty?: string;
  date: string;
  mode?: string;
  status?: string;
  reason?: string;
  doctorRating?: number;
}

interface AppointmentHistoryTableProps {
  userId: string;
}

export function AppointmentHistoryTable({
  userId,
}: AppointmentHistoryTableProps) {
  const router = useRouter();
  const { history, upcoming, loading, fetchAppointments } =
    useAppointmentStore();

  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setShowSkeleton(true);
    setHasFetched(false);

    fetchAppointments(userId).then(() => {
      setHasFetched(true);

      // Keep skeleton for at least 1.5 seconds
      setTimeout(() => {
        setShowSkeleton(false);
      }, 200);
    });
  }, [fetchAppointments, userId]);

  const allAppointments = useMemo(() => {
    const map = new Map<string, Appointment>();
    [...history, ...upcoming].forEach((apt) => map.set(apt.id, apt));
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [history, upcoming]);

  const openViewDetails = useCallback((apt: Appointment) => {
    setSelectedAppointment(apt);
    setViewDetailsOpen(true);
  }, []);

  const closeViewDetails = useCallback(() => {
    setViewDetailsOpen(false);
    setSelectedAppointment(null);
  }, []);

  const handlePayClick = useCallback(() => {
    alert("Payment processing is under development");
  }, []);

  const statusBadges: { [key: string]: JSX.Element } = {
    pending: (
      <Badge className="hover:bg-yellow-50 bg-yellow-100 text-yellow-800 border-yellow-300">
        Pending
      </Badge>
    ),
    approved: (
      <Badge className="hover:bg-green-50 bg-blue-100 text-blue-800 border-blue-300">
        Approved
      </Badge>
    ),
    completed: (
      <Badge className="hover:bg-zinc-50 bg-green-100 text-green-800 border-green-300">
        Completed
      </Badge>
    ),
    cancelled: (
      <Badge className="hover:bg-red-50 bg-red-100 text-red-800 border-red-300">
        Cancelled
      </Badge>
    ),
    rejected: (
      <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>
    ),
  };

  const getStatusBadge = (status = "") => {
    const key = status.toLowerCase();
    return (
      statusBadges[key] || (
        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
          Unknown
        </Badge>
      )
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date unavailable";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading || showSkeleton) {
    // Show skeleton while loading or during 1.5s delay
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg space-y-4">
        
        <div className="grid grid-cols-[1fr_1fr_2fr_2fr_1fr_50px] gap-4 items-center">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />

        </div>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_2fr_2fr_1fr_50px] gap-4 items-center"
          >
            {[...Array(6)].map((_, j) => (
              <Skeleton key={j} className="h-5 w-full rounded-md" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (hasFetched && allAppointments.length === 0) {
    // No appointments after loading & skeleton delay
    return (
      <div className="flex flex-col gap-6 items-center p-8 bg-white rounded-xl shadow-lg text-center text-gray-700">
        <p className="text-lg font-medium">No appointments scheduled</p>
        <Button
          onClick={() => router.push(`/user/${userId}/dashboard/doctors`)}
          className="bg-teal-600 hover:bg-teal-700 text-white w-64 transition-colors"
        >
          Schedule an Appointment
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-white rounded-xl shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-700 font-semibold">
                Patient
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Doctor
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Date & Time
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Mode of Consultation
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-right text-gray-700 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAppointments.map((apt) => (
              <TableRow
                key={apt.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="text-gray-800">
                  {apt.patientName || "Unknown Patient"}
                </TableCell>
                <TableCell className="text-gray-800">
                  {apt.doctorName || "Unknown Doctor"}
                </TableCell>
                <TableCell className="text-gray-800">
                  {formatDateTime(apt.date)}
                </TableCell>
                <TableCell className="text-gray-800 capitalize">
                  {apt.mode || "Not specified"}
                </TableCell>
                <TableCell>{getStatusBadge(apt.status)} </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-gray-200"
                      >
                        <MoreHorizontal className="h-5 w-5 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white shadow-lg rounded-md"
                    >
                      <DropdownMenuItem
                        onClick={() => openViewDetails(apt)}
                        className="text-gray-700 hover:bg-gray-100"
                      >
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handlePayClick}
                        className="text-gray-700 hover:bg-gray-100"
                      >
                        <CreditCard className="mr-2 h-4 w-4" /> Pay
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled className="text-gray-400">
                        More...
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-lg bg-white rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              Appointment Details
            </DialogTitle>
            <DialogClose
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            />
          </DialogHeader>
          {selectedAppointment ? (
            <div className="space-y-6 p-6">
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {selectedAppointment.doctorName || "Unknown Doctor"}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedAppointment.specialty || "Unknown Specialty"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Doctor Rating:{" "}
                  {selectedAppointment.doctorRating !== undefined
                    ? `${selectedAppointment.doctorRating.toFixed(1)} / 5`
                    : "Not rated"}
                </p>
              </div>
              <hr className="border-gray-200" />
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong className="font-medium">Patient:</strong>{" "}
                  {selectedAppointment.patientName || "Unknown Patient"}
                </p>
                <p className="text-gray-700">
                  <strong className="font-medium">Date & Time:</strong>{" "}
                  {formatDateTime(selectedAppointment.date)}
                </p>
                <p className="text-gray-700">
                  <strong className="font-medium">Mode:</strong>{" "}
                  {selectedAppointment.mode || "Not specified"}
                </p>
                <p className="text-gray-700">
                  <strong className="font-medium">Reason:</strong>{" "}
                  {selectedAppointment.reason || "No reason provided"}
                </p>
                <p className="text-gray-700">
                  <strong className="font-medium">Status:</strong>{" "}
                  {selectedAppointment.status || "Unknown"}
                </p>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <Button
                  onClick={handlePayClick}
                  className="bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                >
                  Pay Now
                </Button>
                <Button
                  onClick={closeViewDetails}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 p-6">No appointment selected</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
