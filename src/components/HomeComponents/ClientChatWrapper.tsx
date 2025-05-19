"use client"

import { Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Load ChatPopup only on client side with no SSR
const ChatPopup = dynamic(() => import("@/components/HomeComponents/ChatPopup"), {
  ssr: false,
  loading: () => null,
})

export default function ClientChatWrapper() {
  const [mounted, setMounted] = useState(false)

  // Only show the chat popup after the component has mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <ChatPopup />
    </Suspense>
  )
}
