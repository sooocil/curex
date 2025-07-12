"use client";

import { useEffect, useState } from "react";
import { useDoctorStore } from "@/stores/doctorStores/doctorStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 

interface TestWithDoctorProps {
  isOpen: boolean;
  onClose: () => void;
  testId: string;
  userId: string;
}

export default function TestWithDoctor({
  isOpen,
  onClose,
  testId,
  userId,
}: TestWithDoctorProps) {
  const { doctors, fetchDoctors, isLoading } = useDoctorStore();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  useEffect(() => {
    if (isOpen && doctors.length === 0) {
      fetchDoctors();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDoctorId("");
    }
  }, [isOpen]);

  const handleShare = () => {
    setTimeout(() => {
      if (selectedDoctorId) {
      const doctor = doctors.find((doc) => doc.id === selectedDoctorId);
      toast.success(`Test shared with ${doctor?.name}`, {
        duration: 3000, 
      });
      onClose();
    }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Share Test With Doctor</h2>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading doctors...</p>
        ) : (
          <>
            <select
              className="w-full border rounded p-2 mb-4"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} — {doctor.specialty}
                </option>
              ))}
            </select>

            <div className="flex gap-2 justify-end">
              <Button onClick={handleShare} disabled={!selectedDoctorId}>
                Share
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
