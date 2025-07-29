"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X, Paperclip, Smile } from "lucide-react";
import { useAuthUser } from "@/helpers/getDataFromToken"; 

interface Message {
  id: string;
  sender: "patient" | "doctor";
  content: string;
  timestamp: Date;
  type: "text" | "file";
}

interface ChatPopupProps {
  consultationId: string;
  onClose: () => void;
  isOpen: boolean;
  doctorName: string;
  doctorAvatar?: string;
}

export function ChatPopup({
  isOpen,
  onClose,
  doctorName,
  doctorAvatar,
  consultationId,
}: ChatPopupProps) {
  const { user, loading } = useAuthUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSendMessage = () => {
    if (!user || !newMessage.trim()) return;

    const senderRole = user.role === "doctor" ? "doctor" : "patient";

    const message: Message = {
      id: Date.now().toString(),
      sender: senderRole,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate response for demo, replace with real backend logic later
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (senderRole === "patient") {
        const doctorResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: "doctor",
          content: "Thank you for the info. Let me review your case.",
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, doctorResponse]);
      }
    }, 2000);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (loading) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed bottom-4 right-4 w-96 h-[500px] z-50"
          >
            <Card className="h-full flex flex-col shadow-2xl border-0 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-curex text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={doctorAvatar || "/placeholder.svg"}
                      alt={doctorName}
                    />
                    <AvatarFallback className="bg-white text-curex text-sm">
                      {doctorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-medium">{doctorName}</CardTitle>
                    <p className="text-xs text-curex-light opacity-90">Online</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.sender === "patient" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            message.sender === "patient" ? "order-2" : "order-1"
                          }`}
                        >
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              message.sender === "patient"
                                ? "bg-curex text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {message.content}
                          </div>
                          <p
                            className={`text-xs text-gray-500 mt-1 ${
                              message.sender === "patient" ? "text-right" : "text-left"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 rounded-lg px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
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
        </>
      )}
    </AnimatePresence>
  );
}
