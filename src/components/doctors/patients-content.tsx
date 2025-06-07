"use client";

import { use, useEffect, useState } from "react";
import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Phone, Mail, Calendar, FileText, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientsContent({ doctorId }: { doctorId: string }) {
  const { fetchAppointmentsByDoctorId, appointments, loading } =
    useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (doctorId) fetchAppointmentsByDoctorId(doctorId);
  }, [doctorId]);

  // Unique patients from appointments
  const patients = Array.from(
    new Map(
      (appointments || [])
        .filter((app) => app.user && app.user.email)
        .map((app) => [
          app.user.email,
          {
            id: app._id,
            name: app.user.username,
            email: app.user.email,
            phone: "N/A", // Fill from actual data
            condition: "Follow-up", // You can pass reason if stored in app
            lastVisit: "Not Visited Yet",
            status: app.status,
            avatar: "/placeholder.svg",
          },
        ])
    ).values()
  );
  useEffect(() => {
    //print patient status
    patients.forEach((patient) => {
      console.log(`Patient: ${patient.name}, Status: ${patient.status}`);
    });
  } , [patients]); 

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  function capitalizeName(name: string) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-curex hover:bg-curex/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-lg shadow-sm space-y-4"
            >
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.email}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback>
                        {patient.name
                          ? patient.name.charAt(0).toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {capitalizeName(patient.name)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Condition: {patient.condition}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last Visit: {patient.lastVisit}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" />
                          {patient.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
