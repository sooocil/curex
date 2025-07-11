import { NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import { ActiveConsultation } from "@/models/consultations/consultation";

interface ConsultationProps {
  params: Promise<{ id: string }>;
}

const ConsultationPage = async (
  { params }: ConsultationProps,
  request: Request
) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action"); // action=join or action=end

  if (!action || !["join", "end"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  await connectDB();

  const consultationId = (await params).id;

  const consultation = await ActiveConsultation.findById(consultationId);
  if (!consultation) {
    return NextResponse.json(
      { error: "Consultation not found" },
      { status: 404 }
    );
  }

  if (action === "join") {
    // Logic for joining call
    // Maybe update lastJoinedAt, or log join event for analytics
    return NextResponse.json({ message: "Joined consultation", consultation });
  }

  if (action === "end") {
    consultation.status = "Ended";
    await consultation.save();
    return NextResponse.json({ message: "Consultation ended", consultation });
  }

  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
};
