"use client";

import { useEffect, useState, useRef } from "react";
import socket from "@/lib/socket";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X } from "lucide-react";
import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore";
import { useAuthUser } from "@/helpers/getDataFromToken";

interface Message {
  id: string;
  senderId: string;
  senderRole: "patient" | "doctor";
  content: string;
  timestamp: string;
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  receiverName: string;
  receiverAvatar?: string;
  consultationId: string;
  userId: string;
}

export function ChatPopup({ isOpen, onClose, receiverName, receiverAvatar, consultationId, userId }: ChatPopupProps) {
  const { user } = useAuthUser();
  const { appointments } = useAppointmentStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isApproved = appointments?.find((a) => a._id === consultationId)?.status === "approved";
    if (!isApproved) {
      setError("Chat unavailable: Consultation not approved.");
      return;
    }

    socket.connect();
    socket.emit("joinRoom", consultationId);
    socket.on("receiveMessage", (msg: Message) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.emit("leaveRoom", consultationId);
      socket.disconnect();
    };
  }, [consultationId, appointments]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: userId,
      senderRole: "doctor",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]);
      await axios.post("/api/chat/store", message);
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  if (!isOpen) return null;
  if (error) return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-lg">
      <CardContent className="p-4">{error} <Button onClick={onClose}>Close</Button></CardContent>
    </Card>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed bottom-4 right-4 w-96 h-[500px] z-50"
      >
        <Card className="h-full flex flex-col shadow-2xl border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-curex text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={receiverAvatar || "/placeholder.svg"} alt={receiverName} />
                <AvatarFallback className="bg-white text-curex text-sm">
                  {receiverName.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-sm font-medium">{receiverName}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.senderId === userId ? "bg-curex text-white" : "bg-gray-100 text-gray-900"}`}>
                    {message.content}
                    <p className={`text-xs text-gray-500 mt-1 ${message.senderId === userId ? "text-right" : "text-left"}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 border-0 bg-white focus-visible:ring-1 focus-visible:ring-curex"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-curex hover:bg-curex/90 h-8 w-8 p-0"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}