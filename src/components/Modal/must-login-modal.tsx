"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface MustLoginModalProps {
  open: boolean
  setOpen: (value: boolean) => void
}

export const MustLoginModal = ({ open, setOpen }: MustLoginModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-curex text-2xl">Login Required</DialogTitle>
          <DialogDescription>
            You need to log in to take the health assessment.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-curex text-white" onClick={() => (window.location.href = "/Login")}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
