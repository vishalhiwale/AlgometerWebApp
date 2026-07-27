import express from "express";
import Patient from "../models/Patient";
import { protect, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    // Find latest patient sorted by patientCode descending
    const lastPatient = await Patient.findOne({
      userId: req.user!.id
    })
      .sort({ patientCode: -1 })
      .select("patientCode");

    let newNumber = 1;

    if (lastPatient && lastPatient.patientCode) {
      const lastNumber = parseInt(lastPatient.patientCode.replace("P", ""));
      newNumber = lastNumber + 1;
    }

    const generatedCode = `P${String(newNumber).padStart(3, "0")}`;

    const patient = new Patient({
      ...req.body,
      userId: req.user!.id,
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
router.get("/", protect, async (req: AuthRequest, res) => {
  try {

    const patients = await Patient.find({
      userId: req.user!.id
    });
    res.json(patients);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch patients" 
    });
  }
});

export default router;

//PUT Request to Edit Details
router.put("/:id", protect, async (req: AuthRequest, res) => {
  try {

    console.log("Update ID:", req.params.id);
    console.log("Update Body:", req.body);

    const updatedPatient = await Patient.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id
      },
      req.body,
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update patient" });
  }
});

// Delete Patient
router.delete("/:id",protect, async (req: AuthRequest, res) => {
  try {
    const deletedPatient = await Patient.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id
    });

    if (!deletedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});