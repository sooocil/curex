"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, LogIn } from "lucide-react"
import { Card } from "@/components/ui/card"

interface MustLoginModalProps {
  open: boolean
  setOpen: (value: boolean) => void
}

export const MustLoginModal = ({ open, setOpen }: MustLoginModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
        <Card className="border-none shadow-none">
          <DialogHeader className="bg-gradient-to-r from-[#00AD9B] to-[#009688] p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-white" />
              <DialogTitle className="text-2xl font-bold text-white">
                Authentication Required
              </DialogTitle>
            </div>
            <DialogDescription className="mt-2 text-white/90 text-base">
              Please log in to access the health assessment and personalized healthcare features.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-6 flex justify-end gap-3 bg-gray-50">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={() => (window.location.href = "/Login")}
              className="bg-[#00AD9B] hover:bg-[#009688] text-white font-medium flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Log In
            </Button>
          </DialogFooter>
        </Card>
      </DialogContent>
    </Dialog>
  )
}