"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, X, MinusCircle } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "👋 Hi there! How can I help you with your health concerns today?",
    sender: "bot",
    timestamp: new Date(),
  },
]

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "I understand your concern. Could you tell me more about your symptoms?",
        "Thank you for sharing that information. Have you experienced these symptoms before?",
        "Based on what you've told me, I'd recommend consulting with one of our specialists.",
        "I'm here to help! Is there anything specific you'd like to know about our services?",
        "Would you like me to help you book an appointment with a doctor?",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-curex hover:bg-curex-dark text-white shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`w-80 sm:w-96 shadow-xl transition-all duration-300 ${isMinimized ? "h-14" : "h-[450px]"}`}>
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-curex text-white rounded-t-lg">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-white">
                <AvatarFallback className="text-curex font-bold">C</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Curex Support</h3>
                {!isMinimized && <p className="text-xs">We typically reply in a few minutes</p>}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={minimizeChat}
                  className="h-8 w-8 text-white hover:bg-curex-dark"
                >
                  <MinusCircle className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-8 w-8 text-white hover:bg-curex-dark"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto h-[330px] bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8 mr-2 mt-1 bg-curex">
                          <AvatarFallback className="text-white font-bold">C</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user" ? "bg-curex text-white" : "bg-white border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-3 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="bg-curex hover:bg-curex-dark text-white">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  )
}
