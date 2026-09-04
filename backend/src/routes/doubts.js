import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all doubts
router.get("/", authenticateToken, async (req, res) => {
  try {
    const doubts = await db.orm.public.Doubt.all();

    res.json({ doubts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch doubts" });
  }
});

// CREATE a new doubt
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { studentId, subjectId, question } = req.body;

    if (!studentId || !subjectId || !question?.trim()) {
      return res.status(400).json({
        message: "Student, subject, and question are required"
      });
    }

    const doubt = await db.orm.public.Doubt.create({
      studentId: Number(studentId),
      subjectId: Number(subjectId),
      question: question.trim(),
      solved: false
    });

    res.status(201).json({
      message: "Doubt created successfully",
      doubt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create doubt"
    });
  }
});

export default router;