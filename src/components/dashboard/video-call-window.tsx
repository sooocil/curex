"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Update these import paths to the actual locations of your UI components.
// For example, if you are using shadcn/ui, the imports might look like this:
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, X } from "lucide-react";
import { ChatPopup } from "./chat-popup";

import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import "@livekit/components-styles";

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
  const [token, setToken] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "poor" | "disconnected"
  >("connecting");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch("/api/doctorsApi/vctoken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room: "curex-room",
            username: `user-${consultationId}`,
          }),
        });
        const { token } = await resp.json();
        if (!mounted || !token) return;
        setToken(token);
        setConnectionStatus("connected");
      } catch (e) {
        console.error("Token fetch error:", e);
        setConnectionStatus("disconnected");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [consultationId]);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const handleEndCall = () => {
    onClose();
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

  const tracks = useTracks();

  return (
    <AnimatePresence>
      {isOpen && token && (
        <LiveKitRoom
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          token={token}
          connect
          audio
          video
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed ${isFullscreen ? "inset-0" : "bottom-4 right-4 w-96 h-64"} bg-black rounded-lg shadow-xl z-50 overflow-hidden`}
          >
            <Card className="h-full border-none">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="flex items-center justify-between p-2 bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={patientAvatar} />
                      <AvatarFallback>{patientName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">{patientName}</p>
                      <p className="text-gray-400 text-sm">{callDuration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getConnectionStatusColor()}>
                      {connectionStatus}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleEndCall}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <GridLayout tracks={tracks}>
                    {tracks.map((track: TrackReferenceOrPlaceholder) => (
                      <ParticipantTile
                        key={track.participant.identity}
                        trackRef={track}
                      />
                    ))}
                  </GridLayout>
                  <RoomAudioRenderer />
                </div>

                {isChatOpen && (
                  <ChatPopup
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    consultationId={consultationId}
                    userId={""}
                    doctorName={""}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </LiveKitRoom>
      )}
    </AnimatePresence>
  );
}
