"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocApplicationStore } from "@/stores/doctorStores/docApplicationStore";
import { useDoctorStore } from "@/stores/doctorStores/doctorStore";
import { Users, ClipboardCheck, CheckCircle, Clock } from "lucide-react";
import { useEffect } from "react";

export function DashboardStats() {
  const totalDocs = useDoctorStore((state) => state.doctors);
  const pendingApps = useDocApplicationStore((state) => state.applications);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDocs.length}</div>
          <p className="text-xs text-muted-foreground">
            +{totalDocs.length} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Applications
          </CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingApps.length}</div>
          <p className="text-xs text-muted-foreground">+3 from yesterday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Approved This Week
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDocs.length}</div>
          <p className="text-xs text-muted-foreground">
            +{totalDocs.length + 3} from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Review Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.2 days</div>
          <p className="text-xs text-muted-foreground">
            -0.3 days from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}