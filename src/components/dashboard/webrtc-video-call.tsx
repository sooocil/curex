/* WebRTCVideoCall.tsx */
"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  Settings,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChatPopup } from "./ChatPopupPatient"

interface WebRTCVideoCallProps {
  isOpen: boolean
  onClose: () => void
  doctorName: string
  doctorAvatar?: string
  consultationId: string
  callDuration?: string
  userId: string
}




export function WebRTCVideoCall({
  isOpen,
  onClose,
  doctorName,
  doctorAvatar,
  consultationId,
  callDuration = "00:00",
  userId,
}: WebRTCVideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "poor" | "disconnected">(
    "connecting"
  )
  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended">("calling")

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  const rtcConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  }

  const initializeSocket = useCallback(() => {
    const wsUrl = `ws://localhost:3001/ws?room=${consultationId}&user=${userId}&role=patient`
    const socket = new WebSocket(wsUrl)

    socket.onopen = () => setConnectionStatus("connected")
    socket.onmessage = async (event) => {
      const { type, payload } = JSON.parse(event.data)
      if (type === "offer") await handleOffer(payload)
      if (type === "answer") await handleAnswer(payload)
      if (type === "ice-candidate") await handleIceCandidate(payload)
      if (type === "user-left") setCallStatus("ended")
    }
    socket.onclose = () => setConnectionStatus("disconnected")
    socket.onerror = () => setConnectionStatus("poor")

    socketRef.current = socket
  }, [consultationId, userId])

  const initializePeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(rtcConfiguration)

    pc.onicecandidate = (e) => e.candidate && sendSignalingMessage("ice-candidate", e.candidate)
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]
      setCallStatus("connected")
    }
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState
      if (state === "connected") setConnectionStatus("connected")
      else if (["disconnected", "failed"].includes(state)) setConnectionStatus("disconnected")
    }

    peerConnectionRef.current = pc
  }, [])

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: isVideoOn, audio: true })
    localStreamRef.current = stream
    if (localVideoRef.current) localVideoRef.current.srcObject = stream
    stream.getTracks().forEach((track) => peerConnectionRef.current?.addTrack(track, stream))
  }

  const sendSignalingMessage = (type: string, payload: any) => {
    socketRef.current?.readyState === WebSocket.OPEN &&
      socketRef.current.send(JSON.stringify({ type, payload }))
  }

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return
    await peerConnectionRef.current.setRemoteDescription(offer)
    const answer = await peerConnectionRef.current.createAnswer()
    await peerConnectionRef.current.setLocalDescription(answer)
    sendSignalingMessage("answer", answer)
  }

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return
    await peerConnectionRef.current.setRemoteDescription(answer)
  }

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return
    await peerConnectionRef.current.addIceCandidate(candidate)
  }

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    peerConnectionRef.current?.close()
    socketRef.current?.close()
    localStreamRef.current = null
    peerConnectionRef.current = null
    socketRef.current = null
  }

  useEffect(() => {
    if (isOpen) {
      initializeSocket()
      initializePeerConnection()
      getUserMedia()
    }
    return cleanup
  }, [isOpen, initializeSocket, initializePeerConnection])

  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0]
    if (track) track.enabled = !isVideoOn
    setIsVideoOn(!isVideoOn)
  }

  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0]
    if (track) track.enabled = isMuted
    setIsMuted(!isMuted)
  }

  const handleEndCall = () => {
    cleanup()
    onClose()
  }

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev)

  const getStatusColor = () => {
    return {
      connected: "bg-green-500",
      connecting: "bg-yellow-500",
      poor: "bg-orange-500",
      disconnected: "bg-red-500",
    }[connectionStatus]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isFullscreen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inset-0 bg-black fixed z-40" />}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`absolute z-50 ${isFullscreen ? "inset-0" : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"}`}
          >
            <Card className={`h-full flex flex-col bg-gray-900 text-white ${isFullscreen ? "rounded-none" : "rounded-xl shadow-2xl"}`}>
              <div className="flex items-center justify-between p-4 bg-gray-800/50">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={doctorAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{doctorName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-medium">Dr. {doctorName}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                      <span className="text-xs text-gray-300 capitalize">{connectionStatus}</span>
                      <span className="text-xs text-gray-300">• {callDuration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={toggleFullscreen}>{isFullscreen ? <Minimize2 /> : <Maximize2 />}</Button>
                  <Button size="icon" variant="destructive" onClick={handleEndCall}><Phone /></Button>
                </div>
              </div>
              <div className="flex-1 relative">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-4 right-4 w-32 h-24 rounded-md border border-white/20 object-cover" />
              </div>
              <div className="p-4 flex justify-center gap-4 bg-gray-800">
                <Button variant="ghost" onClick={toggleVideo}>{isVideoOn ? <VideoOff /> : <Video />}</Button>
                <Button variant="ghost" onClick={toggleMute}>{isMuted ? <MicOff /> : <Mic />}</Button>
                <Button variant="ghost" onClick={() => setIsChatOpen(!isChatOpen)}><MessageSquare /></Button>
              </div>
            </Card>
          </motion.div>
          {isChatOpen && <ChatPopup consultationId={consultationId} userId={userId} onClose={() => setIsChatOpen(false)} isOpen={false} doctorName={""}  />}
        </>
      )}
    </AnimatePresence>
  )
}
