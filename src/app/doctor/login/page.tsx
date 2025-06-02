import type { Metadata } from "next";
import { DoctorLoginForm } from "@/components/doctor/login-form";

export const metadata: Metadata = {
  title: "Doctor Login | Curex",
  description: "Login to your doctor dashboard on the Curex platform",
};

export default function DoctorLoginPage() {
  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Doctor Login
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Access your Curex dashboard to manage appointments and consult patients.
        </p>
      </div>
      <DoctorLoginForm />
    </div>
  );
}
