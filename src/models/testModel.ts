// models/testModel.ts
import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  result: { type: String, required: true },
  doctor: { type: String, required: true },
});

export default mongoose.models.Test || mongoose.model("Test", testSchema);