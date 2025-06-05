"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Phone, MessageSquare, Clock, FileText } from "lucide-react";

const activeConsultations = [
  {
    id: 1,
    patient: "John Smith",
    type: "Video Call",
    duration: "30m",
    status: "In Progress",
    startTime: "2:00 PM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const recentConsultations = [
  {
    id: 2,
    patient: "Sarah Johnson",
    type: "Phone Call",
    duration: "25:45",
    status: "Completed",
    endTime: "1:30 PM",
    notes: "Follow-up required in 2 weeks",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    patient: "Mike Wilson",
    type: "Video Call",
    duration: "18:20",
    status: "Completed",
    endTime: "11:45 AM",
    notes: "Prescription updated",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export function ConsultationsContent() {
  async function joinCall(consultationId: string) {
    const res = await fetch(
      `/api/consultations/${consultationId}?action=join`,
      {
        method: "POST",
      }
    );
    const data = await res.json();
    return data;
  }

  async function endCall(consultationId: string) {
    const res = await fetch(`/api/consultations/${consultationId}?action=end`, {
      method: "POST",
    });
    const data = await res.json();
    return data;
  }

  return (
    <div className="space-y-6">
      {activeConsultations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Consultations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between p-4 bg-curex/5 rounded-lg border border-curex/20"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={consultation.avatar || "/placeholder.svg"}
                      alt={consultation.patient}
                    />
                    <AvatarFallback>
                      {consultation.patient
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{consultation.patient}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-sm text-gray-600">
                        {consultation.type === "Video Call" ? (
                          <Video className="h-4 w-4 mr-1" />
                        ) : (
                          <Phone className="h-4 w-4 mr-1" />
                        )}
                        {consultation.type}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {consultation.duration}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800">
                    {consultation.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Chat
                  </Button>

                  <Button
                    onClick={() => joinCall(String(consultation.id))}
                    size="sm"
                    className="bg-curex hover:bg-curex/90"
                  >
                    Join
                  </Button>
                  <Button
                    onClick={() => endCall(String(consultation.id))}
                    size="sm"
                    variant="outline"
                  >
                    End Call
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Consultations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={consultation.avatar || "/placeholder.svg"}
                    alt={consultation.patient}
                  />
                  <AvatarFallback>
                    {consultation.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{consultation.patient}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-gray-600">
                      {consultation.type === "Video Call" ? (
                        <Video className="h-4 w-4 mr-1" />
                      ) : (
                        <Phone className="h-4 w-4 mr-1" />
                      )}
                      {consultation.type}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {consultation.duration}
                    </div>
                  </div>
                  {consultation.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      {consultation.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Ended at</p>
                  <p className="text-sm font-medium">{consultation.endTime}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {consultation.status}
                </Badge>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Notes
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Consultations</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Video Calls</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phone Calls</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Duration</span>
                <span className="font-medium">3h 45m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consultations</span>
                <span className="font-medium">42</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Duration</span>
                <span className="font-medium">22m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Patient Satisfaction</span>
                <span className="font-medium text-curex">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Video className="h-4 w-4 mr-2" />
              Start Video Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Add Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
