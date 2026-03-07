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
  }
  // unit: {
  //   type: String,
  //   default: "kg/cm²"
  // }
});

const readingSchema = new mongoose.Schema(
{
  patientId: {
    type: String,
    required: true
  },

  patientCode: {
    type: String,
    required: true
  },

  patientName: {
    type: String,
    required: true
  },

  doctorName: {
    type: String,
    required: true
  },

  doctorNotes: {
    type: String,
    default: ""
  },

  readings: {
    type: [muscleSchema],
    required: true,
    default: []
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