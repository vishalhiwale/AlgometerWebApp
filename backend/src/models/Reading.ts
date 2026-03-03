import mongoose from "mongoose";

const muscleSchema = new mongoose.Schema({
  muscleName: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  tolerance: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: "kg/cm²"
  }
});

const readingSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    muscles: {
      type: [muscleSchema],
      required: true
    },
    status: {
      type: String,
      enum: ["saved", "committed"],
      default: "committed"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reading", readingSchema);