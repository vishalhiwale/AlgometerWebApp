import mongoose, {Schema} from "mongoose";

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
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // patientId: {
  //   type: String,
  //   required: true
  // }, Old Logic

  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  }, // New Logic

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