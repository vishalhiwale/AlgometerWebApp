import express from "express";
import Patient from "../models/Patient";

const router = express.Router();

// Create new patient
router.post("/", async (req, res) => {
  try {
    // Count existing patients
    const count = await Patient.countDocuments();

    const generatedCode = `P${String(count + 1).padStart(3, "0")}`;

    const patient = new Patient({
      ...req.body,
      patientCode: generatedCode
    });

    const savedPatient = await patient.save();

    res.status(201).json(savedPatient);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create patient" });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

export default router;