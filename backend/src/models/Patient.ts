import mongoose, { Document, Schema } from "mongoose";

export interface IPatient extends Document {
  patientCode: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  lastVisitDate?: Date;
  nextCheckupDate?: Date;
  diagnosis: string;
  status: string;
  createdAt: Date;
}

const PatientSchema: Schema = new Schema(
  {
    patientCode: { type: String, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    diagnosis: { type: String },
    lastVisitDate: { type: Date },
    nextCheckupDate: { type: Date },
    status: { type: String, default: "active" },
    createdAt: {type: Date, default: Date.now}
  },
  { timestamps: true }
);

export default mongoose.model<IPatient>("Patient", PatientSchema);