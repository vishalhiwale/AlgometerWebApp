import express from "express";
import Reading from "../models/Reading";
import {protect, AuthRequest} from "../middleware/authMiddleware";

const router = express.Router();

// Create new reading session
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const reading = new Reading({
      ...req.body,
      userId: req.user!.id
    });
    const savedReading = await reading.save();
    res.status(201).json(savedReading);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to save reading" });
  }
});


// to get only saved readings
router.get("/saved", protect, async (req: AuthRequest, res) => {
  try {
    const readings = await Reading.find({
      status: "saved",
      userId: req.user!.id
    });

    res.json(readings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved readings" });
  }
});

// to get only saved readings
router.get("/readings", protect, async (req: AuthRequest, res) => {
  try {
    const readings = await Reading.find({
      userId: req.user!.id
    });

    res.json(readings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved readings" });
  }
});

// Get readings for a patient
router.get("/:patientId", protect, async (req: AuthRequest, res) => {
  try {
    const readings = await Reading.find({
      patientId: req.params.patientId,
      userId: req.user!.id
    }).sort({ createdAt: -1 });

    res.json(readings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch readings" });
  }
});

// Update Reading
router.put("/:id", protect, async (req: AuthRequest, res) => {
  try {
    const existing = await Reading.findOne({
      _id: req.params.id,
      userId: req.user!.id
    });
    
    if (!existing) {
      return res.status(404).json({ error: "Reading not found" });
    }
    
    if (existing.status === "committed") {
      return res.status(403).json({ error: "Committed readings cannot be modified" });
    }
    
    const updated = await Reading.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user!.id
      },
      req.body,
      { new: true }
    );
    
    res.json(updated);
    
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update reading" });
  }
});

// Delete Reading
router.delete("/:id", protect, async (req: AuthRequest, res) => {
  try {
    const existing = await Reading.findOne({
      _id: req.params.id,
      userId: req.user!.id
    });
    
    if (!existing) {
      return res.status(404).json({ error: "Reading not found" });
    }
    
    if (existing.status === "committed") {
      return res.status(403).json({ error: "Committed readings cannot be deleted" });
    }
    
    await Reading.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id
    });
    
    res.json({ message: "Reading deleted successfully" });
    
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete reading" });
  }
});
export default router;