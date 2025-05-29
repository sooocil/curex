import mongoose from "mongoose";

const doctorapplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  specialty: { type: String, required: true },
  hospital: { type: String, required: true },
  location: { type: String, required: true },
  rate: { type: Number, required: true },
  availability: { type: String, required: true },
  bio: { type: String, required: true },
  education: [
    {
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      year: { type: String, required: true },
    },
  ],
  certifications: [
    {
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      year: { type: String, required: true },
    },
  ],
  documents: {
    medicalLicense: { type: String }, // Stores Base64 string
    boardCertification: { type: String }, // Stores Base64 string
    hospitalPrivileges: { type: String }, // Stores Base64 string
  },
});

export default mongoose.models.Doctorapplications || mongoose.model("Doctorapplications", doctorapplicationSchema);