import mongoose, { Document, Schema } from "mongoose";

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    patientCode: { type: String, required: true },
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

PatientSchema.index(
  {
    userId: 1,
    patientCode: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model<IPatient>("Patient", PatientSchema);