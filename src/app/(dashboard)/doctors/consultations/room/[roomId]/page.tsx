"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  MessageCircle,
  Send,
  FileText,
  Clock,
  User,
  Settings,
  Maximize2,
  Minimize2,
  Share,
} from "lucide-react"

interface Message {
  id: string
  sender: "patient" | "doctor"
  message: string
  timestamp: Date
  type: "text" | "file" | "prescription"
}

interface Note {
  id: string
  content: string
  timestamp: Date
  category: "symptoms" | "diagnosis" | "treatment" | "general"
}


export default function ConsultationRoomPage() {
  const router = useRouter()
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "notes">("chat")
  const [chatMessage, setChatMessage] = useState("")
  const [newNote, setNewNote] = useState("")
  const [noteCategory, setNoteCategory] = useState<"symptoms" | "diagnosis" | "treatment" | "general">("symptoms")
  const [consultationStartTime] = useState(new Date())
  const [duration, setDuration] = useState("00:00")
  const roomId = useParams().roomId;

  const videoRef = useRef<HTMLVideoElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "doctor",
      message: "Hello! I can see you're here for your follow-up. How are you feeling today?",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
    },
    {
      id: "2",
      sender: "patient",
      message: "Hi Doctor. I'm feeling much better since our last consultation. The medication has been helping.",
      timestamp: new Date(Date.now() - 240000),
      type: "text",
    },
  ])

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Patient reports improvement with current medication",
      timestamp: new Date(Date.now() - 240000),
      category: "general",
    },
  ])

  const consultationInfo = {
    patientName: "Sarah Johnson",
    doctorName: "Dr. Michael Chen",
    roomId: roomId,
    consultationType: "Follow-up",
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = now.getTime() - consultationStartTime.getTime()
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setDuration(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [consultationStartTime])

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "patient", // This would be dynamic based on user role
        message: chatMessage,
        timestamp: new Date(),
        type: "text",
      }
      setMessages([...messages, newMessage])
      setChatMessage("")
    }
  }

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        timestamp: new Date(),
        category: noteCategory,
      }
      setNotes([...notes, note])
      setNewNote("")
    }
  }

  const endCall = () => {
    router.push("/consultation/patient")
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Video className="w-6 h-6 text-[#00AD9B]" />
              <h1 className="text-xl font-semibold text-gray-800">Consultation Room</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <span>Patient: {consultationInfo.patientName}</span>
              <span>•</span>
              <span>Doctor: {consultationInfo.doctorName}</span>
              <span>•</span>
              <span>{consultationInfo.consultationType}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected</span>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Video Section */}
        <div className="flex-1 relative bg-gray-900">
          {/* Main video area */}
          <div className="relative h-full">
            {/* Doctor's video (main) */}
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-[#00AD9B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12" />
                </div>
                <p className="text-lg font-medium">{consultationInfo.doctorName}</p>
                <p className="text-sm text-gray-300">Video connected</p>
              </div>
            </div>

            {/* Patient's video (picture-in-picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="w-6 h-6" />
                  </div>
                  <p className="text-sm">You</p>
                </div>
              </div>
            </div>

            {/* Video controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                </button>

                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isAudioOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                </button>

                <button className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors">
                  <Share className="w-5 h-5 text-white" />
                </button>

                <button onClick={endCall} className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
                  <Phone className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors"
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${
                activeTab === "chat"
                  ? "text-[#00AD9B] border-b-2 border-[#00AD9B] bg-[#00AD9B]/5"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${
                activeTab === "notes"
                  ? "text-[#00AD9B] border-b-2 border-[#00AD9B] bg-[#00AD9B]/5"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "patient" ? "bg-[#00AD9B] text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "patient" ? "text-[#00AD9B]/70" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AD9B] focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-[#00AD9B] text-white rounded-lg hover:bg-[#009688] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="flex-1 flex flex-col">
              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          note.category === "symptoms"
                            ? "bg-red-100 text-red-800"
                            : note.category === "diagnosis"
                              ? "bg-blue-100 text-blue-800"
                              : note.category === "treatment"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {note.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {note.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{note.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Note */}
              <div className="p-4 border-t border-gray-200 space-y-3">
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AD9B] focus:border-transparent text-sm"
                >
                  <option value="symptoms">Symptoms</option>
                  <option value="diagnosis">Diagnosis</option>
                  <option value="treatment">Treatment</option>
                  <option value="general">General</option>
                </select>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addNote()}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AD9B] focus:border-transparent text-sm"
                  />
                  <button
                    onClick={addNote}
                    className="px-4 py-2 bg-[#00AD9B] text-white rounded-lg hover:bg-[#009688] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
