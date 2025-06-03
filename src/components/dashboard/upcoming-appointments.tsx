"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppointmentStore } from "@/stores/doctorStores/appointmentStore";
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

//interface for props
interface UpcomingAppointmentsProps {
  uId: string;
}

export function UpcomingAppointments({uId}: UpcomingAppointmentsProps) {
  const { upcoming, loading, fetchAppointments } = useAppointmentStore();
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace 'userId' with the actual user id from context/auth/store
    const userId = uId;
    fetchAppointments(userId);
  }, [fetchAppointments]);

  useEffect(() => {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(now.getDate() + 30);

    const filtered = upcoming
      .filter((appointment: any) => {
        const date = new Date(appointment.date);
        return date >= now && date <= in30Days;
      })
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setFilteredAppointments(filtered);
  }, [upcoming]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
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
                filteredAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-curex/10 text-curex">
                          {(appointment.doctor ?? "Dr").split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.specialty} • {appointment.date} • {appointment.time}
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
                <Link href="/dashboard/appointments">View all appointments</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
