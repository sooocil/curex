"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import axios from "axios";

interface ChatMessage {
  senderId: string;
  senderRole: "patient";
  consultationId: string;
  message: string;
  timestamp: string;
}

interface PatientChatPopupProps {
  isOpen?: boolean;
  consultationId: string;
  userId: string;
  doctorName: string;
  onClose: () => void;
}

export function PatientChatPopup({ consultationId, userId, onClose }: PatientChatPopupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", consultationId);

    socket.on("receiveMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveRoom", consultationId);
      socket.disconnect();
    };
  }, [consultationId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg: ChatMessage = {
      senderId: userId,
      senderRole: "patient",
      consultationId,
      message: input,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");

    await axios.post("/api/chat/store", msg);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border shadow-lg rounded-lg z-50 p-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold">Chat with Doctor</h4>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="h-60 overflow-y-auto my-2 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.senderId === userId ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}>
            <p className="text-sm">{m.message}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Type message"
        />
        <button onClick={sendMessage} className="bg-curex text-white px-3 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
