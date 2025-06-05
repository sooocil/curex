"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { ChatPopup } from "./chat-popup";
import toast, { Toaster } from "react-hot-toast";

interface VideoCallWindowProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientAvatar?: string;
  consultationId: string;
  callDuration?: string;
}

export function VideoCallWindow({
  isOpen,
  onClose,
  patientName,
  patientAvatar,
  consultationId,
  callDuration = "00:00",
}: VideoCallWindowProps) {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "poor" | "disconnected"
  >("connected");

  const videoRef = useRef<HTMLVideoElement>(null);
  const callWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate getting user media
    if (isVideoOn && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.log("Error accessing media devices:", err));
    }
  }, [isVideoOn]);

  const handleEndCall = () => {
    // Clean up media streams
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "poor":
        return "bg-orange-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
            ref={callWindowRef}
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
                    <AvatarImage
                      src={patientAvatar || "/placeholder.svg"}
                      alt={patientName}
                    />
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
                      <div
                        className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}
                      />
                      <span className="text-xs text-gray-300 capitalize">
                        {connectionStatus}
                      </span>
                      <span className="text-xs text-gray-300">
                        • {callDuration}
                      </span>
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
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
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
                <div
                  className={`grid h-full ${isChatOpen && !isFullscreen ? "grid-cols-3" : "grid-cols-1"}`}
                >
                  {/* Main Video Area */}
                  <div
                    className={`relative ${isChatOpen && !isFullscreen ? "col-span-2" : "col-span-1"} bg-gray-800`}
                  >
                    {/* Patient Video (Main) */}
                    <div className="select-none w-full h-full bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <Avatar className="h-24 w-24 mx-auto mb-4">
                          <AvatarImage
                            src={patientAvatar || "/placeholder.svg"}
                            alt={patientName}
                          />
                          <AvatarFallback className="bg-curex text-white text-2xl">
                            {patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-white font-medium">{patientName}</p>
                        <Badge variant="secondary" className="mt-2">
                          {isVideoOn ? "Video On" : "Video Off"}
                        </Badge>
                      </div>
                    </div>

                    {/* Doctor Video (Picture-in-Picture) */}
                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg border-2 border-white/20 overflow-hidden">
                      {isVideoOn ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          className="w-full h-full object-cover"
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
                      <Badge
                        className={`${getConnectionStatusColor()} text-white`}
                      >
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
                      onClick={() => setIsMuted(!isMuted)}
                      className={`h-12 w-12 rounded-full ${
                        isMuted
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      } text-white`}
                    >
                      {isMuted ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (isVideoOn) {
                          setIsVideoOn(false);
                          toast.success("Video opened", { position: "bottom-left" });
                        } else {
                          setIsVideoOn(true);
                          toast.error("Video closed",  { position: "bottom-left" });
                        }
                      }}
                      className={`h-12 w-12 rounded-full ${
                        !isVideoOn
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      } text-white`}
                    >
                      {isVideoOn ? (
                        <Video className="h-5 w-5" />
                      ) : (
                        <VideoOff className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className={`h-12 w-12 rounded-full ${
                        isChatOpen
                          ? "bg-curex hover:bg-curex/90"
                          : "bg-gray-700 hover:bg-gray-600"
                      } text-white`}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>

                    {/* Monitor Button  */}

                    {/* <Button
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      <Monitor className="h-5 w-5" />
                    </Button> */}

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
            <Toaster
              position="bottom-left"
              toastOptions={{
                
                duration: 1000,
              }}
              // Limit to 3 toasts at a time
              
            />
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
  );
}
