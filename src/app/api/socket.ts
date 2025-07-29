import { Server } from "socket.io";

export default function handler(req: any, res: any) {
  if (res.socket.server.io) return res.end(); 

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("join", (roomId) => {
      socket.join(roomId);
    });

    socket.on("send-message", ({ roomId, message }) => {
      io.to(roomId).emit("receive-message", message);
    });
  });

  res.end();
}
