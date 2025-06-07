"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  Clock,
  Video,
  User,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";

const STATUS_MAP = {
  pending: { label: "Pending", icon: AlertCircle, color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  busy: { label: "Busy", icon: XCircle, color: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800" },
};

type ModeType = "Online" | "In-person";
const MODE_MAP: Record<ModeType, { icon: typeof Video; color: string }> = {
  Online: { icon: Video, color: "text-blue-600" },
  "In-person": { icon: User, color: "text-purple-600" },
};

export function AppointmentsContent({ doctorId }: { doctorId?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const {
    appointments,
    loading,
    fetchAppointmentsByDoctorId,
    approveAppointment,
    markBusyAppointment,
  } = useAppointmentStore();

  useEffect(() => {
    if (doctorId) fetchAppointmentsByDoctorId(doctorId);
  }, [doctorId]);

  const filtered = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter((a) => {
      const matchesSearch =
        a.user?.username.toLowerCase().includes(search.toLowerCase()) ||
        a.reason?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || a.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [appointments, search, filter]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const handleAction = async (id: string, action: "approve" | "busy") => {
    try {
      action === "approve"
        ?  approveAppointment(id)
        :  markBusyAppointment(id);
      toast.success(`Appointment ${action === "approve" ? "approved" : "marked busy"}`);
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/doctorsApi/appointments/deleteapp", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      fetchAppointmentsByDoctorId(doctorId!);
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by patient or reason..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-center text-muted-foreground">No appointments found.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((appt) => {
            const mode = MODE_MAP[appt.user?.mode as ModeType] || MODE_MAP["In-person"];
            return (
              <Card key={appt._id}>
                <CardContent className="p-5 flex justify-between">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{appt.user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {appt.user?.username}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {appt.reason || "General Consultation"}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(appt.date)}
                        </span>
                        <span className="flex items-center">
                          <mode.icon className={`w-4 h-4 mr-1 ${mode.color}`} />
                          {appt.user?.mode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    {(() => {
                      const status = STATUS_MAP[appt.status as keyof typeof STATUS_MAP];
                      return (
                        <Badge className={`${status.color} w-auto text-xs mr-8 mt-6`}>
                          <status.icon className="w-3 h-3 mr-1 " />
                          {status.label}
                        </Badge>
                      );
                    })()}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 mt-4">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {appt.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleAction(appt._id, "approve")}
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(appt._id, "busy")}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Mark Busy
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(appt._id)}
                          className="text-red-600"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
