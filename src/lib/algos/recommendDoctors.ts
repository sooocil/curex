import { RESULT_SPECIALTY_MAP } from "./symptomSpecialtyMap";
import { DoctorType } from "@/types/DoctorType";

const WEIGHTS = {
  specialtyMatch: 4,
  availability: 2,
  hospitalNearby: 2,
  highRating: 1,
};

export function recommendDoctors(result: string, doctors: DoctorType[]): DoctorType[] {
  const relevantSpecialties = RESULT_SPECIALTY_MAP[result] || [];

  return doctors
    .map((doc) => {
      let score = 0;
      if (relevantSpecialties.includes(doc.specialty)) score += WEIGHTS.specialtyMatch;
      if (doc.availability) score += WEIGHTS.availability;
      if (doc.hospital?.toLowerCase().includes("chitwan")) score += WEIGHTS.hospitalNearby;
      if (doc.rate && doc.rate > 4.5) score += WEIGHTS.highRating;

      return { ...doc, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // return top 6
}
