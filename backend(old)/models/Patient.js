import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  patientCode: {type: String, unique: true},
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String },
  contact: {type: String},
  lastVisitDate: {type: String},
  nextCheckupDate: {type: String},
  diagnosis: { type: String },
  status: {type: String, default: "active"},
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);

