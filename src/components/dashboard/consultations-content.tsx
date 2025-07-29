"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Video,
  Phone,
  MessageSquare,
  Clock,
  FileText,
  Calendar,
} from "lucide-react";
import { usePatAppointmentStore } from "@/stores/patAppointment/usePatAppointmentsStore";
import { useParams } from "next/navigation";

export  function PatientConsultationsContent() {
  const params = useParams();
  const userID = params?.userId as string | undefined;
  

  const { fetchAppointmentsByUserId, appointments, loading, error } = usePatAppointmentStore();

  const [chatOpen, setChatOpen] = useState<{ isOpen: boolean; consultation: any | null }>({
    isOpen: false,
    consultation: null,
  });
  const [videoCallOpen, setVideoCallOpen] = useState<{ isOpen: boolean; consultation: any | null }>({
    isOpen: false,
    consultation: null,
  });

  useEffect(() => {
    if (userID) {
      fetchAppointmentsByUserId(userID);
    }
  }, [userID, fetchAppointmentsByUserId]);

  if (!userID) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-600">
          <p>User ID is missing from the URL. Please check the link.</p>
        </CardContent>
      </Card>
    );
  }

  const today = new Date();

  const transformAppointment = (appointment: any) => ({
    id: appointment._id,
    doctorName: appointment.doctor?.name ?? "Dr. Unknown",
    doctorSpecialty: appointment.doctor?.specialty ?? "General Medicine",
    type: appointment.user?.mode ?? "Video Call",
    duration: "30m",
    status: appointment.status === "approved" ? "Scheduled" : appointment.status,
    appointmentTime: new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    appointmentDate: new Date(appointment.date).toLocaleDateString(),
    avatar: "/placeholder.svg",
    reason: appointment.reason ?? "General consultation",
  });

  const activeConsultations = (appointments ?? [])
    .filter((a) => a.status === "approved" && new Date(a.date).toDateString() === today.toDateString())
    .map(transformAppointment);

  const recentConsultations = (appointments ?? [])
    .filter((a) => a.status === "approved" && new Date(a.date) < today)
    .map((a) => ({
      ...transformAppointment(a),
      status: "Completed",
      endTime: new Date(a.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notes: "Consultation completed successfully",
    }))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">Error loading consultations: {error}</p>
          <Button onClick={() => fetchAppointmentsByUserId(userID)} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {activeConsultations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Today's Consultations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeConsultations.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 bg-curex/5 rounded-lg border border-curex/20"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={c.avatar} alt={c.doctorName} />
                    <AvatarFallback>
                      {c.doctorName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{c.doctorName}</h3>
                    <p className="text-sm text-gray-600">{c.doctorSpecialty}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        {c.type === "Video Call" ? (
                          <Video className="h-4 w-4 mr-1" />
                        ) : (
                          <Phone className="h-4 w-4 mr-1" />
                        )}
                        {c.type}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {c.appointmentTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800">{c.status}</Badge>
                  <Button
                    onClick={() => setVideoCallOpen({ isOpen: true, consultation: c })}
                    size="sm"
                    className="bg-curex hover:bg-curex/90"
                  >
                    Join Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setChatOpen({ isOpen: true, consultation: c })}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" /> Chat
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations today</h3>
            <p className="text-gray-600 mb-4">
              You don't have any scheduled consultations for today.
            </p>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Consultations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentConsultations.length > 0 ? (
            recentConsultations.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={c.avatar} alt={c.doctorName} />
                    <AvatarFallback>
                      {c.doctorName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{c.doctorName}</h3>
                    <p className="text-sm text-gray-600">{c.doctorSpecialty}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        {c.type === "Video Call" ? (
                          <Video className="h-4 w-4 mr-1" />
                        ) : (
                          <Phone className="h-4 w-4 mr-1" />
                        )}
                        {c.type}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {c.duration}
                      </div>
                    </div>
                    {c.notes && <p className="text-sm text-gray-600 mt-1">{c.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-sm font-medium">{c.appointmentDate}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{c.status}</Badge>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Notes
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No recent consultations found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
