"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string; // ISO format
  time: string;
}

interface UpcomingAppointmentsProps {
  uId: string;
}

export function UpcomingAppointments({ uId }: UpcomingAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      // fallback to dummy data in development
      if (process.env.NODE_ENV === "development") {
        setAppointments([
          {
            id: "1",
            doctor: "Dr. Alice Smith",
            specialty: "Cardiology",
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            time: "10:00 AM",
          },
          {
            id: "2",
            doctor: "Dr. Bob Johnson",
            specialty: "Dermatology",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            time: "2:30 PM",
          },
          {
            id: "3",
            doctor: "Dr. Carol Lee",
            specialty: "Pediatrics",
            date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            time: "9:00 AM",
          },
        ]);
      }

      setLoading(false);
    };

    fetchAppointments();
  }, [uId]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(now.getDate() + 30);

    return appointments
      .filter((appointment) => {
        const date = new Date(appointment.date);
        return date >= now && date <= in30Days;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments Schedule</CardTitle>
        <CardDescription>Your scheduled doctor appointments</CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-curex/10 text-curex">
                          {appointment.doctor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.specialty} • {appointment.date} •{" "}
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/appointments/${appointment.id}`}>
                        Details
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-md">
                  No upcoming appointments in the next 30 days.
                </p>
              )}
            </div>

            <div className="mt-36 text-center">
              <Button asChild variant="link" className="text-curex">
                <Link href={`/user/${uId}/dashboard/appointments`}>
                  View all appointments
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
