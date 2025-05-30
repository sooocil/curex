"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

export function DoctorVerificationActions({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string) => {
    if (!id) {
      toast({
        title: "Error",
        description: "Invalid application ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let message = "";
      const response = await fetch("/api/doctorsApi/docapplications/rejectapp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to perform action");
      }

      switch (action) {
        case "approve":
          message = "Doctor application approved successfully";
          break;
        case "reject":
          message = "Doctor application rejected";
          break;
        case "info_needed":
          message = "Additional information requested from doctor";
          break;
      }

      toast({
        title: "Action completed",
        description: message,
      });

      setTimeout(() => {
        router.push("/admin/doctor-applications");
      }, 1500);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The action could not be completed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => handleAction("approve")}
        className="bg-green-500 hover:bg-green-600 text-white"
        disabled={isLoading || !id}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Approve
      </Button>
      <Button
        onClick={() => handleAction("reject")}
        className="bg-red-500 hover:bg-red-600 text-white"
        disabled={isLoading || !id}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}
        Reject
      </Button>
      <Button
        onClick={() => handleAction("info_needed")}
        variant="outline"
        disabled={isLoading || !id}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <AlertCircle className="mr-2 h-4 w-4" />
        )}
        Request Info
      </Button>
    </div>
  );
}