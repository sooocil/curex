const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const WebSocket = require("ws")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

// Room store
const rooms = new Map()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const wss = new WebSocket.Server({ server })

  wss.on("connection", (ws, req) => {
    const { query } = parse(req.url, true)
    const { room, user, role } = query

    console.log(`User ${user} (${role}) joined room ${room}`)

    if (!rooms.has(room)) rooms.set(room, new Map())
    const roomUsers = rooms.get(room)
    roomUsers.set(user, { ws, role })

    roomUsers.forEach((userData, userId) => {
      if (userId !== user && userData.ws.readyState === WebSocket.OPEN) {
        userData.ws.send(
          JSON.stringify({
            type: "user-joined",
            payload: { userId: user, role },
          })
        )
      }
    })

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message)
        console.log(`Message from ${user}:`, data.type)

        roomUsers.forEach((userData, userId) => {
          if (userId !== user && userData.ws.readyState === WebSocket.OPEN) {
            userData.ws.send(message)
          }
        })
      } catch (error) {
        console.error("Error parsing message:", error)
      }
    })

    ws.on("close", () => {
      console.log(`User ${user} left room ${room}`)
      roomUsers.delete(user)

      roomUsers.forEach((userData) => {
        if (userData.ws.readyState === WebSocket.OPEN) {
          userData.ws.send(
            JSON.stringify({
              type: "user-left",
              payload: { userId: user },
            })
          )
        }
      })

      if (roomUsers.size === 0) {
        rooms.delete(room)
      }
    })
  })

  const PORT = process.env.PORT || 3001
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`)
    console.log(`> WebSocket Signaling Server running on port ${PORT}`)
  })
})
