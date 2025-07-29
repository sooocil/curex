"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { EditableVital } from "@/components/EditableVital"; // adjust path if needed
import { usePatientStatsStore } from "@/stores/patientStats/patientStatsStore";

interface UserOverviewStatsProps {
  userId: string;

}

export function UserOverviewStats({ userId }: UserOverviewStatsProps) {
  const { stats, fetchStats, updateStats } = usePatientStatsStore();

  useEffect(() => {
    if (userId) fetchStats(userId);
  }, [userId, fetchStats]);

  const handleUpdate = async (field: keyof typeof stats, rawValue: string) => {
    let parsedValue: string | number = rawValue;

    if (field === "heartRate" || field === "bloodGlucose") {
      const parsed = parseInt(rawValue);
      if (isNaN(parsed)) return toast.error(`Invalid number for ${field}`);
      parsedValue = parsed;
    }

    if (field === "temperature") {
      const parsed = parseFloat(rawValue);
      if (isNaN(parsed)) return toast.error("Invalid temperature");
      parsedValue = parsed;
    }

    if (field === "bloodPressure") {
      const regex = /^\d{2,3}\/\d{2,3}$/;
      if (!regex.test(rawValue)) {
        return toast.error("Invalid blood pressure format (e.g., 120/80)");
      }
    }

    await updateStats(userId, { [field]: parsedValue });
    toast.success(`${field} updated successfully`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <EditableVital
        label="Heart Rate"
        value={stats.heartRate.toString()}
        unit="BPM"
        onSave={(val) => handleUpdate("heartRate", val)}
      />
      
      <EditableVital
        label="Blood Pressure"
        value={stats.bloodPressure}
        placeholder="120/80"
        onSave={(val) => handleUpdate("bloodPressure", val)}
      />
      <EditableVital
        label="Temperature"
        value={stats.temperature.toString()}
        unit="°F"
        onSave={(val) => handleUpdate("temperature", val)}
      />
      <EditableVital
        label="Blood Glucose"
        value={stats.bloodGlucose.toString()}
        unit="mg/dL"
        onSave={(val) => handleUpdate("bloodGlucose", val)}
      />
    </div>
  );
}
