import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Next.js setup
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Create a single instance of Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins during dev; restrict in production
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a room (e.g., consultationId)
    socket.on("room:join", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Leave a room
    socket.on("room:leave", (roomId) => {
      socket.leave(roomId);
    });

    // Handle incoming message and broadcast to room
    socket.on("message:send", ({ consultationId, message }) => {
      socket.to(consultationId).emit("message:receive", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Start HTTP server
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
