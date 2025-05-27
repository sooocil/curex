import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import doctorapplicationSchema from "@/models/doctor/doctorapplications";
import bcrypt from "bcrypt";

const parseForm = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const fields: Record<string, any> = {};
    const files: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string" && "arrayBuffer" in value) {
        // Handle file-like objects
        const buffer = Buffer.from(await value.arrayBuffer());
        const base64String = buffer.toString("base64");
        const mimeType = value.type || "application/octet-stream";
        const fileName = value.name || `${Date.now()}-file`;

        files[key] = files[key] || [];
        files[key].push({
          base64: `data:${mimeType};base64,${base64String}`,
          originalFilename: fileName,
          mimetype: mimeType,
          size: buffer.length,
        });
      } else {
        // Handle string fields
        fields[key] = fields[key]
          ? Array.isArray(fields[key])
            ? [...fields[key], value]
            : [fields[key], value]
          : value;
      }
    }

    return { fields, files };
  } catch (error) {
    console.error("Error parsing form data:", error);
    throw error;
  }
};

export async function GET() {
  return NextResponse.json({ message: "Doctor registration endpoint is working" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { fields, files } = await parseForm(req);

    const education = fields.education
      ? JSON.parse(Array.isArray(fields.education) ? fields.education[0] : fields.education)
      : [];
    const certifications = fields.certifications
      ? JSON.parse(Array.isArray(fields.certifications) ? fields.certifications[0] : fields.certifications)
      : [];

    const doctorData = {
      name: Array.isArray(fields.name) ? fields.name[0] : fields.name,
      email: Array.isArray(fields.email) ? fields.email[0] : fields.email,
      password: await bcrypt.hash(Array.isArray(fields.password) ? fields.password[0] : fields.password, 10),
      phone: Array.isArray(fields.phone) ? fields.phone[0] : fields.phone,
      specialty: Array.isArray(fields.specialty) ? fields.specialty[0] : fields.specialty,
      hospital: Array.isArray(fields.hospital) ? fields.hospital[0] : fields.hospital,
      location: Array.isArray(fields.location) ? fields.location[0] : fields.location,
      rate: fields.rate ? parseFloat(Array.isArray(fields.rate) ? fields.rate[0] : fields.rate) : 0,
      availability: Array.isArray(fields.availability) ? fields.availability[0] : fields.availability,
      bio: Array.isArray(fields.bio) ? fields.bio[0] : fields.bio,
      education,
      certifications,
      documents: {
        medicalLicense: files.medicalLicense ? files.medicalLicense[0].base64 : null,
        boardCertification: files.boardCertification ? files.boardCertification[0].base64 : null,
        hospitalPrivileges: files.hospitalPrivileges ? files.hospitalPrivileges[0].base64 : null,
      },
    };

    const doctor = new doctorapplicationSchema(doctorData);
    const savedDoctor = await doctor.save();

    return NextResponse.json({ message: "Doctor registered successfully", data: savedDoctor }, { status: 201 });
  } catch (error: any) {
    console.error("Doctor registration failed due to:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}