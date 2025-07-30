"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  Settings,
  Monitor,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { ChatPopup } from "./ChatPopupDoctor"

interface WebRTCVideoCallProps {
  isOpen: boolean
  onClose: () => void
  patientName: string
  patientAvatar?: string
  consultationId: string
  callDuration?: string
  doctorId: string
}

export function WebRTCVideoCall({
  isOpen,
  onClose,
  patientName,
  patientAvatar,
  consultationId,
  callDuration = "00:00",
  doctorId,
}: WebRTCVideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "poor" | "disconnected">(
    "connecting",
  )
  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended">("calling")

  // Refs for video elements and WebRTC
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  // WebRTC configuration
  const rtcConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
  }

  // Initialize WebSocket connection
  const initializeSocket = useCallback(() => {
    const wsUrl = `ws://localhost:3001/ws?room=${consultationId}&user=${doctorId}&role=doctor`
    socketRef.current = new WebSocket(wsUrl)

    socketRef.current.onopen = () => {
      console.log("WebSocket connected")
      setConnectionStatus("connected")
    }

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      await handleSignalingMessage(data)
    }

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected")
      setConnectionStatus("disconnected")
    }

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      setConnectionStatus("poor")
    }
  }, [consultationId, doctorId])

  // Handle signaling messages
  const handleSignalingMessage = async (data: any) => {
    const { type, payload } = data

    switch (type) {
      case "offer":
        await handleOffer(payload)
        break
      case "answer":
        await handleAnswer(payload)
        break
      case "ice-candidate":
        await handleIceCandidate(payload)
        break
      case "user-joined":
        console.log("User joined:", payload.userId)
        break
      case "user-left":
        console.log("User left:", payload.userId)
        setCallStatus("ended")
        break
    }
  }

  // Send signaling message
  const sendSignalingMessage = (type: string, payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, payload }))
    }
  }

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    peerConnectionRef.current = new RTCPeerConnection(rtcConfiguration)

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalingMessage("ice-candidate", event.candidate)
      }
    }

    // Handle remote stream
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
        setCallStatus("connected")
      }
    }

    // Handle connection state changes
    peerConnectionRef.current.onconnectionstatechange = () => {
      const state = peerConnectionRef.current?.connectionState
      if (state === "connected") {
        setConnectionStatus("connected")
        setCallStatus("connected")
      } else if (state === "disconnected" || state === "failed") {
        setConnectionStatus("disconnected")
      }
    }
  }, [])

  // Get user media
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: true,
      })

      localStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Add tracks to peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, stream)
        })
      }

      return stream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      throw error
    }
  }

  // Create offer
  const createOffer = async () => {
    if (!peerConnectionRef.current) return

    try {
      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)
      sendSignalingMessage("offer", offer)
    } catch (error) {
      console.error("Error creating offer:", error)
    }
  }

  // Handle offer
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return

    try {
      await peerConnectionRef.current.setRemoteDescription(offer)
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)
      sendSignalingMessage("answer", answer)
    } catch (error) {
      console.error("Error handling offer:", error)
    }
  }

  // Handle answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return

    try {
      await peerConnectionRef.current.setRemoteDescription(answer)
    } catch (error) {
      console.error("Error handling answer:", error)
    }
  }

  // Handle ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return

    try {
      await peerConnectionRef.current.addIceCandidate(candidate)
    } catch (error) {
      console.error("Error handling ICE candidate:", error)
    }
  }

  // Initialize call
  useEffect(() => {
    if (isOpen) {
      initializeSocket()
      initializePeerConnection()

      getUserMedia().then(() => {
        // Start the call by creating an offer
        setTimeout(() => {
          createOffer()
        }, 1000)
      })
    }

    return () => {
      cleanup()
    }
  }, [isOpen, initializeSocket, initializePeerConnection])

  // Cleanup function
  const cleanup = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Close WebSocket
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn
        setIsVideoOn(!isVideoOn)
      }
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = isMuted
        setIsMuted(!isMuted)
      }
    }
  }

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })

        // Replace video track
        if (peerConnectionRef.current && localStreamRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0]
          const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === "video")

          if (sender) {
            await sender.replaceTrack(videoTrack)
          }

          // Update local video
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream
          }

          setIsScreenSharing(true)

          // Handle screen share end
          videoTrack.onended = () => {
            setIsScreenSharing(false)
            // Switch back to camera
            getUserMedia()
          }
        }
      } catch (error) {
        console.error("Error sharing screen:", error)
      }
    } else {
      // Stop screen sharing and switch back to camera
      setIsScreenSharing(false)
      getUserMedia()
    }
  }

  // End call
  const handleEndCall = () => {
    cleanup()
    onClose()
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      case "poor":
        return "bg-orange-500"
      case "disconnected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for fullscreen */}
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
            />
          )}

          {/* Video Call Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`fixed z-50 ${
              isFullscreen
                ? "inset-0"
                : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"
            }`}
          >
            <Card
              className={`h-full flex flex-col shadow-2xl border-0 bg-gray-900 text-white overflow-hidden ${
                isFullscreen ? "rounded-none" : "rounded-lg"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={patientAvatar || "/placeholder.svg"} alt={patientName} />
                    <AvatarFallback className="bg-curex text-white text-sm">
                      {patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{patientName}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} />
                      <span className="text-xs text-gray-300 capitalize">{connectionStatus}</span>
                      <span className="text-xs text-gray-300">• {callDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEndCall}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Video Content */}
              <CardContent className="flex-1 p-0 relative">
                <div className={`grid h-full ${isChatOpen && !isFullscreen ? "grid-cols-3" : "grid-cols-1"}`}>
                  {/* Main Video Area */}
                  <div className={`relative ${isChatOpen && !isFullscreen ? "col-span-2" : "col-span-1"} bg-gray-800`}>
                    {/* Remote Video (Patient) */}
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ transform: "scaleX(-1)" }}
                    />

                    {/* Show avatar if no remote video */}
                    {callStatus !== "connected" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                        <div className="text-center">
                          <Avatar className="h-24 w-24 mx-auto mb-4">
                            <AvatarImage src={patientAvatar || "/placeholder.svg"} alt={patientName} />
                            <AvatarFallback className="bg-curex text-white text-2xl">
                              {patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-white font-medium">{patientName}</p>
                          <Badge variant="secondary" className="mt-2">
                            {callStatus === "calling" ? "Calling..." : "Connecting..."}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Local Video (Doctor - Picture-in-Picture) */}
                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg border-2 border-white/20 overflow-hidden">
                      {isVideoOn ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                          style={{ transform: "scaleX(-1)" }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <VideoOff className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      </div>
                    </div>

                    {/* Connection Quality Indicator */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getConnectionStatusColor()} text-white`}>
                        {connectionStatus === "connected" && "HD"}
                        {connectionStatus === "poor" && "Poor Connection"}
                        {connectionStatus === "connecting" && "Connecting..."}
                        {connectionStatus === "disconnected" && "Disconnected"}
                      </Badge>
                    </div>
                  </div>

                  {/* Chat Sidebar */}
                  {isChatOpen && !isFullscreen && (
                    <motion.div
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 300 }}
                      className="bg-white border-l border-gray-200"
                    >
                      <div className="h-full">
                        <ChatPopup
                          isOpen={true}
                          onClose={() => setIsChatOpen(false)}
                          patientName={patientName}
                          patientAvatar={patientAvatar}
                          consultationId={consultationId}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-4 bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className={`h-12 w-12 rounded-full ${
                        isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"
                      } text-white`}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleVideo}
                      className={`h-12 w-12 rounded-full ${
                        !isVideoOn ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"
                      } text-white`}
                    >
                      {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className={`h-12 w-12 rounded-full ${
                        isChatOpen ? "bg-curex hover:bg-curex/90" : "bg-gray-700 hover:bg-gray-600"
                      } text-white`}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleScreenShare}
                      className={`h-12 w-12 rounded-full ${
                        isScreenSharing ? "bg-curex hover:bg-curex/90" : "bg-gray-700 hover:bg-gray-600"
                      } text-white`}
                    >
                      <Monitor className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEndCall}
                      className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Phone className="h-5 w-5 rotate-[135deg]" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Standalone Chat Popup for fullscreen mode */}
          {isFullscreen && (
            <ChatPopup
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              patientName={patientName}
              patientAvatar={patientAvatar}
              consultationId={consultationId}
            />
          )}
        </>
      )}
    </AnimatePresence>
  )
}
