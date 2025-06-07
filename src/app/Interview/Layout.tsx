import type React from "react"
export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-gray-50 min-h-screen">{children}</div>
}

