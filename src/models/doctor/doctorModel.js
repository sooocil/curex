import { eachHourOfInterval } from "date-fns";
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    // Professional Info
    specialty: {
      type: String,
      enum: {
        values: [
          "Cardiology",
          "Dermatology",
          "Endocrinology",
          "Gastroenterology",
          "General Medicine",
          "Neurology",
          "Oncology",
          "Pediatrics",
          "Psychiatry",
          "Surgery",
        ],
        message: "{VALUE} is not a valid specialty",
      },
      required: true,
    },
    hospital: {
      type: String,

      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      default: "Available",
    },
    bio: {
      type: String,
    },

    // Education & Certifications
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        year: { type: String },
      },
    ],
    certifications: [
      {
        name: { type: String },
        issuer: { type: String },
        year: { type: String },
      },
    ],

    // Documents
    documents: {
      medicalLicense: { type: String, default: null },
      boardCertification: { type: String, default: null },
      hospitalPrivileges: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("doctors", doctorSchema);

export default Doctor;
