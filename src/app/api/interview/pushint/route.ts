import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/dbConfig/dbConfig";
import symptomAssessmentModel from "@/models/symptomassessment/symptomAssessmentModel";

export async function POST(request: NextRequest) {
  console.log("=== API Route Started ===");
  
  try {
    // Step 1: Connect to database
    console.log("1. Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    // Step 2: Parse request body
    console.log("2. Parsing request body...");
    const body = await request.json();
    console.log("✅ Request body parsed:", JSON.stringify(body, null, 2));

    // Step 3: Extract and transform data
    console.log("3. Extracting data...");
    const {
      userId,
      mainSymptom = body.q1,
      duration = body.q2,
      hasFever = body.q3,
      temperature = body.q4,
      hasCough = body.q5,
      coughType = body.q6,
      painLevel = body.q7,
      hasFatigue = body.q8,
      contactWithSick = body.q9,
      otherSymptoms = body.q10,
    } = body;

    console.log("✅ Extracted data:", {
      userId,
      mainSymptom,
      duration,
      hasFever,
      temperature,
      hasCough,
      coughType,
      painLevel,
      hasFatigue,
      contactWithSick,
      otherSymptoms
    });

    // Step 4: Validate userId
    console.log("4. Validating userId...");
    if (!userId) {
      console.log("❌ userId is missing");
      return NextResponse.json(
        { error: "userId is required", receivedData: body },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      console.log("❌ userId is invalid:", userId);
      return NextResponse.json(
        { error: "Invalid userId format", userId },
        { status: 400 }
      );
    }
    console.log("✅ userId is valid:", userId);

    // Step 5: Create assessment data
    console.log("5. Creating assessment data...");
    const assessmentData = {
      userId: new ObjectId(userId),
      mainSymptom: mainSymptom || null,
      duration: duration || null,
      hasFever: hasFever || null,
      temperature: temperature || 98.6,
      hasCough: hasCough || null,
      coughType: coughType || null,
      painLevel: painLevel || 0,
      hasFatigue: hasFatigue || null,
      contactWithSick: contactWithSick || null,
      otherSymptoms: otherSymptoms || null,
      createdAt: new Date(),
    };
    console.log("✅ Assessment data prepared:", assessmentData);

    // Step 6: Create model instance
    console.log("6. Creating model instance...");
    const newAssessment = new symptomAssessmentModel(assessmentData);
    console.log("✅ Model instance created");

    // Step 7: Save to database
    console.log("7. Saving to database...");
    const savedAssessment = await newAssessment.save();
    console.log("✅ Assessment saved successfully:", savedAssessment._id);

    return NextResponse.json(savedAssessment, { status: 201 });

  } catch (error) {
    // Narrow error to type 'any' for property access
    const err = error as any;
    console.error("❌ ERROR in POST /api/interview/pushint:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    
    // Log specific error types
    if (err.name === 'ValidationError') {
      console.error("Validation errors:", err.errors);
      return NextResponse.json(
        { 
          error: "Validation Error", 
          details: err.errors,
          message: err.message 
        },
        { status: 400 }
      );
    }
    
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      console.error("MongoDB error:", err);
      return NextResponse.json(
        { error: "Database Error", message: err.message },
        { status: 500 }
      );
    }

    if (err.name === 'CastError') {
      console.error("Cast error:", err);
      return NextResponse.json(
        { error: "Invalid data format", message: err.message },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: err.message,
        name: err.name 
      },
      { status: 500 }
    );
  }
}