import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import SymptomAssessment from "@/models/symptomassessment/symptomAssessmentModel";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await connectDB();

    const symptoms = await SymptomAssessment.find({ userId: id });

    const transformed = symptoms.map((test:any) => ({
      id: test._id.toString(), 
      name: test.mainSymptom || "N/A",
      date: new Date(test.createdAt).toLocaleDateString(),
      doctor: test.username || "Not Assigned",
      result: determineResult(test), 
    }));

    return NextResponse.json(transformed, { status: 200 });
  } catch (err) {
    console.error("Error Fetching symptom:", err);
    return NextResponse.json(
      { error: "Failed to fetch symptom data" },
      { status: 500 }
    );
  }
}

// optional helper
function determineResult(test: any): string {
  if (test.painLevel > 7 || test.hasFever === "yes") return "Abnormal";
  if (test.painLevel > 3) return "High";
  return "Normal";
}
