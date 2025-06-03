
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import * as z from "zod";
import axios from "axios";
import { useParams } from "next/navigation";

interface AppointmentModalProps {
  doctorName: string;
  doctorId: string;
  onClose: () => void;
}

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
];

// Zod schema for validation
const appointmentSchema = z.object({
  selectedDate: z
    .date()
    .refine((date) => !dayjs(date).isBefore(dayjs(), "day"), {
      message: "Date cannot be in the past",
    }),
  selectedTime: z
    .string()
    .min(1, { message: "Time must be selected" })
    .regex(/^([0-1]?[0-9]):([0-5][0-9]) (AM|PM)$/, {
      message: "Invalid time format. Use hh:mm AM/PM",
    }),
  reason: z
    .string()
    .max(500, { message: "Reason cannot exceed 500 characters" })
    .optional(),
});

export default function AppointmentModal({
  doctorName,
  doctorId,
  onClose,
}: AppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [errors, setErrors] = useState<{
    selectedDate?: string;
    selectedTime?: string;
    reason?: string;
  }>({});

  const { userId } = useParams();

  const validate = () => {
    const now = dayjs();
    const errors: { selectedDate?: string; selectedTime?: string; reason?: string } = {};

    // Validate date
    if (!selectedDate) {
      errors.selectedDate = "Please select a valid date";
    } else if (dayjs(selectedDate).isBefore(now, "day")) {
      errors.selectedDate = "Date cannot be in the past";
    }

    // Validate time
    if (!selectedTime) {
      errors.selectedTime = "Please select a time slot";
    } else {
      // Validate format
      if (!/^([0-1]?[0-9]):([0-5][0-9]) (AM|PM)$/.test(selectedTime)) {
        errors.selectedTime = "Invalid time format. Use hh:mm AM/PM";
      } else {
        // Prevent past time slots for today
        const selectedDateTime = dayjs(
          `${dayjs(selectedDate).format("YYYY-MM-DD")} ${selectedTime}`,
          "YYYY-MM-DD hh:mm A"
        );
        if (
          dayjs(selectedDate).isSame(now, "day") &&
          selectedDateTime.isBefore(now)
        ) {
          errors.selectedTime = "Selected time has already passed";
        }
      }
    }

    // Validate reason
    if (reason && reason.length > 500) {
      errors.reason = "Reason cannot exceed 500 characters";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    const payload = {
      userId,
      doctorId,
      date: dayjs(selectedDate).format("YYYY-MM-DD"), // e.g., "2025-06-03"
      time: selectedTime, 
      reason: reason || "No reason provided",
    };

    try {
      console.log("Sending payload:", payload);
      await axios.post("/api/users/appointments/bookapp", payload);
      alert(
        `Appointment booked with Dr. ${doctorName} on ${dayjs(
          selectedDate
        ).format("MMM D, YYYY")} at ${selectedTime}`
      );
      onClose();
    } catch (error: any) {
      console.error("Error booking appointment:", error.response?.data || error.message);
      alert(`Failed to book appointment: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule your appointment with <strong>{doctorName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="w-full md:w-1/2 border border-gray-300 rounded-md p-4 shadow-sm bg-white">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => dayjs(date).isBefore(dayjs(), "day")}
              className="rounded-md"
            />
            {errors.selectedDate && (
              <p className="text-xs text-red-600 mt-1">{errors.selectedDate}</p>
            )}
          </div>

          <div className="w-full md:w-1/2 p-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((time) => {
                const isToday = selectedDate && dayjs(selectedDate).isSame(dayjs(), "day");
                const slotDateTime = selectedDate
                  ? dayjs(
                      `${dayjs(selectedDate).format("YYYY-MM-DD")} `,
                      "YYYY-MM-DD"
                    )
                  : null;
                const isPast = isToday && slotDateTime && slotDateTime.isBefore(dayjs());

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={!!isPast}
                    className={cn(
                      "text-sm font-medium py-2 px-3 rounded-md border transition-colors whitespace-nowrap",
                      isPast
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : selectedTime === time
                        ? "bg-curex text-white border-curex"
                        : "bg-white text-curex border-gray-300 hover:text-black"
                    )}
                    onClick={() => !isPast && setSelectedTime(time)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            {errors.selectedTime && (
              <p className="text-xs text-red-600 mt-2">{errors.selectedTime}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Reason for Appointment (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            placeholder="Enter reason for appointment"
            className="w-full p-2 border rounded-md resize-y"
          />
          {errors.reason && (
            <p className="text-xs text-red-600 mt-1">{errors.reason}</p>
          )}
        </div>

        <DialogFooter className="mt-6">
          <div className="w-full flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}