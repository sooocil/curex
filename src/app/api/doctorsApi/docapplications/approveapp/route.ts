import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import doctorModel from "@/models/doctor/doctorModel";
import doctorApplicationModel from "@/models/doctor/doctorapplications";
import mongoose, { isValidObjectId } from "mongoose";

await connectDB();

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  try {
    const { id, status } = await req.json();
    console.log("Received:", { id, status });

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid or missing doctor application ID." },
        { status: 400 }
      );
    }

    const validStatuses = ["approved", "rejected", "info_needed"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status provided." },
        { status: 400 }
      );
    }

    let responseData: { success: boolean; doctorId?: string } = {
      success: true,
    };

    await session.withTransaction(async () => {
      const application = await doctorApplicationModel
        .findById(id)
        .session(session);
      if (!application) {
        throw new Error("Doctor application not found.");
      }

      if (status === "approved") {
        const existingDoctor = await doctorModel
          .findOne({ email: application.email })
          .session(session);
        if (existingDoctor) {
          throw new Error("Doctor already exists.");
        }

        const { _id, status, ...doctorData } = application.toObject();
        const newDoctor = await doctorModel.create(
          [
            {
              ...doctorData,
              status: "approved", 
              approvedAt: new Date(),
            },
          ],
          { session }
        );

        responseData.doctorId = newDoctor[0]._id;
      }

      await doctorApplicationModel.findByIdAndUpdate(
        id,
        {
          status,
          approvedAt: status === "approved" ? new Date() : undefined,
        },
        { session }
      );
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      {
        error: error || "An error occurred while processing the application.",
      },
      {
        status:
          error === "Doctor application not found."
            ? 404
            : error === "Doctor already exists."
              ? 409
              : 500,
      }
    );
  } finally {
    session.endSession();
  }
}
