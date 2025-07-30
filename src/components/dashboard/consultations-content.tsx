"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthUser } from "@/helpers/getDataFromToken";
import { PatientChatPopup } from "@/components/dashboard/ChatPopupPatient";

type Consultation = {
  _id: string;
  doctorId: {
    _id: string;
    firstName: string;
    specialization: string;
  };
  type: "Phone Call" | "Video Call";
  status: "approved" | "pending" | "rejected";
  startTime: string;
};

export default function PatientConsultationPage() {
  const { user, loading } = useAuthUser();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchConsultations = async () => {
      try {
        const res = await axios.get(`/api/consultation/patient?id=${user._id}`);

        setConsultations(res.data);
      } catch (error) {
        console.error("Failed to fetch consultations", error);
      }
    };

    fetchConsultations();
  }, [user?.email]);

  if (loading) {
    return <div className="p-4">Loading consultations...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Your Consultations</h2>

      {consultations.length === 0 ? (
        <div className="text-gray-500">No consultations found.</div>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div
              key={consultation._id}
              className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Dr. {consultation.doctorId.firstName}
                </p>
                <p className="text-sm text-gray-600">
                  {consultation.doctorId.specialization}
                </p>
                <p className="text-sm text-gray-500">
                  {consultation.type} •{" "}
                  {new Date(consultation.startTime).toLocaleString()}
                </p>
                <p
                  className={`text-sm font-medium ${consultation.status === "approved" ? "text-green-600" : consultation.status === "pending" ? "text-yellow-600" : "text-red-600"}`}
                >
                  Status: {consultation.status}
                </p>
              </div>

              {consultation.status === "approved" && (
                <button
                  onClick={() => {
                    setActiveChatId(consultation._id);
                    setSelectedDoctorId(consultation.doctorId._id);
                  }}
                  className="bg-curex text-white px-4 py-1 rounded hover:opacity-90"
                >
                  Chat
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeChatId && selectedDoctorId && user?.email && (
        <PatientChatPopup
          consultationId={activeChatId}
          userId={user.email}
          onClose={() => setActiveChatId(null)}
          doctorName={""}
        />
      )}
    </div>
  );
}
