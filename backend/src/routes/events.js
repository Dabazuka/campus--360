import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all events
router.get("/", authenticateToken, async (req, res) => {
  try {
    const events = await db.orm.public.Event.all();

    res.json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// CREATE event
router.post("/", authenticateToken, async (req, res) => {
    if (String(req.user.role).toUpperCase() !== "TEACHER") {
    return res.status(403).json({
      message: "Only teachers can create events"
    });
  }

  try {
    const { title, date, time, type } = req.body;

    const event = await db.orm.public.Event.create({
      title,
      date,
      time,
      type,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create event" });
  }
});

// DELETE event
router.delete("/:id", authenticateToken, async (req, res) => {
    if (String(req.user.role).toUpperCase() !== "TEACHER") {
    return res.status(403).json({
      message: "Only teachers can delete events"
    });
  }
  
  try {
    const eventId = Number(req.params.id);

    const deletedEvent = await db.orm.public.Event
      .where({ id: eventId })
      .delete();

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

export default router;