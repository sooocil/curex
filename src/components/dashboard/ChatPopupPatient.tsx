"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import axios from "axios";
import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  senderId: string;
  senderRole: "patient" | "doctor";
  consultationId: string;
  message: string;
  timestamp: string;
}

interface PatientChatPopupProps {
  consultationId: string;
  userId: string;
  doctorName: string;
  onClose: () => void;
}

export function PatientChatPopup({ consultationId, userId, doctorName, onClose }: PatientChatPopupProps) {
  const { appointments } = useAppointmentStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isApproved = appointments?.find((a) => a._id === consultationId)?.status === "approved";
    if (!isApproved) {
      setError("Chat unavailable: Consultation not approved.");
      return;
    }

    socket.connect();
    socket.emit("joinRoom", consultationId);
    socket.on("receiveMessage", (msg: ChatMessage) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.emit("leaveRoom", consultationId);
      socket.disconnect();
    };
  }, [consultationId, appointments]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg: ChatMessage = {
      senderId: userId,
      senderRole: "patient",
      consultationId,
      message: input,
      timestamp: new Date().toISOString(),
    };

    try {
      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      await axios.post("/api/chat/store", msg);
      setInput("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  if (error) return <div className="fixed bottom-4 right-4 w-96 bg-white border rounded-lg p-4">{error} <Button onClick={onClose}>Close</Button></div>;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border shadow-lg rounded-lg z-50 p-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold">Chat with Dr. {doctorName}</h4>
        <Button onClick={onClose}>✕</Button>
      </div>
      <div className="h-60 overflow-y-auto my-2 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.senderId === userId ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}>
            <p className="text-sm">{m.message}</p>
            <p className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Type message"
        />
        <Button onClick={sendMessage} className="bg-curex text-white px-3 py-1 rounded">Send</Button>
      </div>
    </div>
  );
}