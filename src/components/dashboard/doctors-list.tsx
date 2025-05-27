"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { useDoctorStore } from "@/stores/doctorStore";

export const DoctorsList = () => {
  const doctors = useDoctorStore((state) => state.doctors);
  const fetchDoctors = useDoctorStore((state) => state.fetchDoctors);
  const isLoading = useDoctorStore((state) => state.isLoading);
  const error = useDoctorStore((state) => state.error);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex border-t">
                <Skeleton className="h-10 flex-1 rounded-none" />
                <Skeleton className="h-10 flex-1 rounded-none" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor, index) => (
        <Card key={doctor.id ? doctor.id : `doctor-${index}`} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-curex/10 text-curex">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
                <Badge className="bg-curex">${doctor.rate}/min</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="flex items-center text-yellow-400 mr-1">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-muted-foreground ml-1">
                    ({doctor.reviews} reviews)
                  </span>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Hospital:</span>{" "}
                  {doctor.hospital}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Location:</span>{" "}
                  {doctor.location}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Available:</span>{" "}
                  {doctor.availability}
                </p>
              </div>
            </div>
            <div className="flex border-t">
              <Button className="flex-1 rounded-none bg-white text-curex hover:bg-gray-50 hover:text-curex-dark">
                View Profile
              </Button>
              <Button className="flex-1 rounded-none bg-curex hover:bg-curex-dark text-white">
                Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
