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

    // const patient = new Patient({
    //   ...req.body,
    //   uid: req.body.uid,   // 🔥 ADD THIS LINE
    //   patientCode: newCode,
    //    photo: req.file ? req.file.filename : null
    // });
    const patient = new Patient({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      contact: req.body.contact,
      diagnosis: req.body.diagnosis,
      lastVisitDate: req.body.lastVisitDate,
      nextCheckupDate: req.body.nextCheckupDate,
      status: req.body.status,
      uid: req.body.uid,   // 🔥 FORCE IT
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
// router.get("/", async (req, res) => {
//   try {
//     const patients = await Patient.find();
  router.get("/", async (req, res) => {
  try {
    const { uid } = req.query;   // 🔥 GET UID

    console.log("UID received in backend:", uid);   // 🔥 ADD THIS

    const patients = await Patient.find({ uid });   // 🔥 FILTER

    console.log("UID received in backend:", uid);   // 🔥 ADD THIS

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