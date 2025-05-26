// src/components/ui/spinner.tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center bg-transparent", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
    </div>
  );
}
