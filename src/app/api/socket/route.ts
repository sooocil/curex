// app/api/socket/route.ts
import { NextRequest } from "next/server"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function GET(req: NextRequest) {
  return new Response("This route is for WebSocket only", {
    status: 426,
    headers: {
      "Content-Type": "text/plain",
      "Upgrade": "websocket",
      Connection: "Upgrade",
    },
  })
}
