"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { useDoctorStore } from "@/stores/doctorStores/doctorStore";
import toast from "react-hot-toast";
import Viewdoctormodal from "@/components/Modal/userdashboard/viewdoctormodal";
import AppointmentModal from "@/components/Modal/userdashboard/bookappointment";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  availability: string;
  rating: number;
  reviews: number;
  rate: number;
}

export const DoctorsList = () => {
  const doctors = useDoctorStore((state) => state.doctors);
  const fetchDoctors = useDoctorStore((state) => state.fetchDoctors);
  const isLoading = useDoctorStore((state) => state.isLoading);
  const error = useDoctorStore((state) => state.error);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [bookAppointmentModal, setBookAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const viewDocProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  };

  const closeAllModals = () => {
    setShowProfileModal(false);
    setBookAppointmentModal(false);
    setSelectedDoctor(null);
  };

  const bookApp = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookAppointmentModal(true);
  };

  useEffect(() => {
    const handleReload = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault(); // Prevent full page reload
        fetchDoctors(); // Just refetch the doctor list
        toast.success("Doctor list refreshed!");
      }
    };

    window.addEventListener("keydown", handleReload);

    return () => {
      window.removeEventListener("keydown", handleReload);
    };
  }, [fetchDoctors]);

  if (isLoading) {
    return (
      <div className="left-0 grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                {/* Top section: Avatar, Name, Specialty, Rate */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />{" "}
                    {/* Avatar */}
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" /> {/* Name */}
                      <Skeleton className="h-3 w-24" /> {/* Specialty */}
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-md" />{" "}
                  {/* Rate badge */}
                </div>

                {/* Middle section: Rating, Hospital, Location, Availability */}
                <div className="space-y-2 text-sm">
                  <Skeleton className="h-4 w-28" /> {/* Rating */}
                  <Skeleton className="h-3 w-36" /> {/* Hospital */}
                  <Skeleton className="h-3 w-32" /> {/* Location */}
                  <Skeleton className="h-3 w-28" /> {/* Availability */}
                </div>
              </div>

              {/* Bottom section: Buttons */}
              <div className="flex border-t">
                <Skeleton className="h-10 w-full rounded-none" />{" "}
                {/* View Profile */}
                <Skeleton className="h-10 w-full rounded-none" />{" "}
                {/* Book Appointment */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="ml-2 mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor, index) => (
          <Card
            key={doctor.id || `doctor-${index}`}
            className="overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="p-6">
                {/* Doctor Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
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

                {/* Doctor Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-sm text-yellow-500">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    {doctor.rating} ({doctor.reviews} reviews)
                  </div>
                  <p>
                    <span className="text-muted-foreground">Hospital:</span>{" "}
                    {doctor.hospital}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Location:</span>{" "}
                    {doctor.location}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Available:</span>{" "}
                    {doctor.availability}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t">
                <Button
                  onClick={() => viewDocProfile(doctor)}
                  className="flex-1 rounded-none bg-white text-curex hover:bg-gray-50 hover:text-curex-dark"
                >
                  View Profile
                </Button>
                <Button
                  onClick={() => bookApp(doctor)}
                  className="flex-1 rounded-none bg-curex hover:bg-curex-dark text-white"
                >
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal outside loop */}
      {showProfileModal && selectedDoctor && (
        <Viewdoctormodal
          doctor={selectedDoctor}
          onClose={closeAllModals}
          onBookAppointment={(doctor) => {
            closeAllModals();
            setSelectedDoctor(doctor);
            setBookAppointmentModal(true);
          }}
        />
      )}

      {bookAppointmentModal && (
        <AppointmentModal
          doctorName={selectedDoctor?.name ?? ""}
          doctorId={selectedDoctor?.id ?? ""}
          onClose={closeAllModals}
        />
      )}
    </>
  );
};
