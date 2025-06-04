import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
      match: [
        /^([0-1]?[0-9]):([0-5][0-9]) (AM|PM)$/,
        "Time must be in the format hh:mm AM/PM",
      ],
    },

    reason: {
      type: String,
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
      default: "No reason provided",
    },
    mode: {
      type: String,
      enum: ["online", "in-person"],
      default: "Online",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Appointment =
  mongoose.models["Appointment"] ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;
