import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import SymptomAssessment from "@/models/symptomassessment/symptomAssessmentModel";

// Optional: Uncomment if you use zod
// import { z } from "zod";

// const ParamsSchema = z.object({
//   id: z.string().min(1, "Symptom ID is required"),
// });

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symptomId = searchParams.get("id");

    // Validate ID
    if (!symptomId || typeof symptomId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing Symptom ID." },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDB();

    // Attempt deletion
    const deleted = await SymptomAssessment.findByIdAndDelete(symptomId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Symptom not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Symptom deleted successfully.",
        data: {
          id: deleted._id,
          name: deleted.name,
          createdAt: deleted.createdAt,
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ DELETE /symptoms Error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while deleting symptom." },
      { status: 500 }
    );
  }
}
