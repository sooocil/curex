import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";
import { Server as NetServer } from "http";
import type { NextApiResponseWithSocket } from "@/types/socket";

export const config = {
  api: { bodyParser: false },
};

const ioHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server as NetServer, {
      path: "/api/socketio",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
      });

      socket.on("sendMessage", (msg) => {
        io.to(msg.consultationId).emit("receiveMessage", msg);
      });

      socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
