"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ToggleRow from "./ToggleRow";

export default function SettingPageClient() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* System Toggles */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">System Preferences</h2>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ToggleRow
            label="Maintenance Mode"
            description="Temporarily disable public access while performing updates."
          />
          <ToggleRow
            label="Enable Online Consultation"
            description="Allow doctors and patients to consult online via platform."
          />
          <ToggleRow
            label="Allow Hospital Registrations"
            description="Enable new hospitals/clinics to register through the system."
          />
        </CardContent>
      </Card>

      {/* Doctor Verification */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Doctor Verification</h2>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ToggleRow
            label="Manual Approval Required"
            description="Require admin review before a doctor profile is published."
          />
          <ToggleRow
            // onCheckedChange={async (checked) => {
            //   await fetch("/api/admin/settings/notify-new-applications", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ enabled: checked }),
            //   });
            // }}
            label="Notify on New Applications"
            description="Send admin email/in-app notifications for new doctor signups."
          />
        </CardContent>
      </Card>

      {/* Platform Controls */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Platform Controls</h2>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="outline">Export Platform Data</Button>
          <Button variant="destructive">Clear Test Data</Button>
        </CardContent>
      </Card>
    </div>
  );
}
