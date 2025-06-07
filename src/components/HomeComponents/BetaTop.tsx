"use client"

import { useState } from "react"
import { X } from "lucide-react"

const BetaTop = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="w-full bg-curex text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <span className="bg-zinc-800 text-white text-md font-bold px-2 py-1 rounded-full mr-2">BETA</span>
          <p className="text-lg">Curex is currently in <strong>Beta</strong>. br Some of the features may not be available yet.</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close beta notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default BetaTop
