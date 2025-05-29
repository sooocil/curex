import type { Metadata } from "next";
import { DoctorApplicationDetails } from "@/components/admin/doctor-application-details";
import { DoctorVerificationActions } from "@/components/admin/doctor-verification-actions";

export const metadata: Metadata = {
  title: "Application Details | Curex Admin",
  description: "Review doctor application details",
};

export default function DoctorApplicationDetailsPage({
  params,
}: {
  params: { id :any };
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Application Details
        </h1>
        <DoctorVerificationActions id={params.id} />
      </div>
      <DoctorApplicationDetails id={params.id} />
    </div>
  );
}
