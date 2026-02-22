import express from "express";
import Patient from "../models/Patient.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
// Create new patient (with sequential patientCode)
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    // Find most recently created patient
    const lastPatient = await Patient.findOne().sort({ createdAt: -1 });

    let newCode = "P001";

    if (lastPatient && lastPatient.patientCode) {
      const lastNumber = parseInt(lastPatient.patientCode.substring(1));
      const nextNumber = lastNumber + 1;
      newCode = "P" + String(nextNumber).padStart(3, "0");
    }

    const patient = new Patient({
      ...req.body,
      patientCode: newCode,
      photo: req.file ? req.file.filename : null
    });

    const savedPatient = await patient.save();

    res.status(201).json(savedPatient);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

// Delete patient
router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update patient
router.put("/:id", async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});