import { DoctorApplicationDetails } from "@/components/admin/doctor-application-details";
import { DoctorVerificationActions } from "@/components/admin/doctor-verification-actions";
import type { Metadata } from "next";
import type { FC } from "react";

interface DoctorApplicationDetailsPageProps {
  params: Promise<{ id: string }>;
}

const DoctorApplicationDetailsPage: FC<DoctorApplicationDetailsPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Application Details</h1>
        <DoctorVerificationActions id={id} />
      </div>
      <DoctorApplicationDetails id={id} />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Application Details | Curex Admin",
  description: "Review doctor application details",
};

export default DoctorApplicationDetailsPage;