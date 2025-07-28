import { ReactNode } from "react";

export interface DoctorType {
  id?: string;
  _id?: string;
  name: string;
  specialty: string;
  hospital: string;
  contact?: string; 
  rate?: number;
  rating?: number;
  reviews?: number;
  availability: string | boolean;
  email?: string;
  password?: string;
  phone?: string;
  bio?: string;
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    year: string;
  }[];
  documents?: {
    medicalLicense?: string;
    boardCertification?: string;
    hospitalPrivileges?: string;
  };
  status?: "pending" | "approved" | "rejected";
  createdAt?: string | Date;
  score?: number;
}