import express from "express";
import Reading from "../models/Reading";

const router = express.Router();

// Create new reading session
router.post("/", async (req, res) => {
  try {
    const reading = new Reading(req.body);
    const savedReading = await reading.save();
    res.status(201).json(savedReading);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to save reading" });
  }
});

// Get readings for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const readings = await Reading.find({
      patientId: req.params.patientId
    }).sort({ createdAt: -1 });

    res.json(readings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch readings" });
  }
});

export default router;

router.put("/:id", async (req, res) => {
  try {
    const existing = await Reading.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: "Reading not found" });
    }

    if (existing.status === "committed") {
      return res.status(403).json({ error: "Committed readings cannot be modified" });
    }

    const updated = await Reading.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update reading" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing = await Reading.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: "Reading not found" });
    }

    if (existing.status === "committed") {
      return res.status(403).json({ error: "Committed readings cannot be deleted" });
    }

    await Reading.findByIdAndDelete(req.params.id);

    res.json({ message: "Reading deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete reading" });
  }
});