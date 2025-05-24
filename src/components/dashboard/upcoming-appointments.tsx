"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UpcomingAppointments() {
  const { upcoming, loading, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  if (loading) {
    // Simple skeleton loader, can be improved
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled doctor appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
                style={{ minHeight: 56 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                    <div className="w-48 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled doctor appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcoming.map((appointment:any) => (
            <div key={appointment.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-curex/10 text-curex">
                    {appointment.doctor
                      .split(" ")
                      .map((n:any) => n[0])
                      .join("")}
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
                <Link href={`/dashboard/appointments/${appointment.id}`}>Details</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="link" className="text-curex">
            <Link href="/dashboard/appointments">View all appointments</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
