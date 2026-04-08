import express from "express";
import Patient from "../models/Patient";

const router = express.Router();

// Create new patient
// router.post("/", async (req, res) => {
//   try {
//     // Count existing patients
//     const count = await Patient.countDocuments();

//     const generatedCode = `P${String(count + 1).padStart(3, "0")}`;

//     const patient = new Patient({
//       ...req.body,
//       patientCode: generatedCode
//     });

//     const savedPatient = await patient.save();

//     res.status(201).json(savedPatient);

//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: "Failed to create patient" });
//   }
// });
router.post("/", async (req, res) => {
  try {
    // Find latest patient sorted by patientCode descending
    const lastPatient = await Patient.findOne()
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

//PUT Request to Edit Details
router.put("/:id", async (req, res) => {
  try {

    console.log("Update ID:", req.params.id);
    console.log("Update Body:", req.body);

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
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
router.delete("/:id", async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});