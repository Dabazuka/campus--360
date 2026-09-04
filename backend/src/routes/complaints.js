import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all complaints
router.get("/", authenticateToken, async (req, res) => {
  try {
    const complaints = await db.orm.public.Complaint.all();
    const students = await db.orm.public.Student.all();

    const formattedComplaints = complaints.map((complaint) => {
      const student = students.find(
        (student) => student.id === complaint.studentId
      );

      return {
        ...complaint,
        student: student?.name || "Unknown Student",
        date: complaint.createdAt
      };
    });

    res.json({ complaints: formattedComplaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch complaints"
    });
  }
});

// CREATE complaint
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      studentId,
      section,
      category,
      title,
      description
    } = req.body;

    if (!studentId || !section || !category || !title?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "All complaint fields are required"
      });
    }

    const complaint = await db.orm.public.Complaint.create({
      studentId: Number(studentId),
      section,
      category,
      title: title.trim(),
      description: description.trim(),
      status: "PENDING"
    });

    res.status(201).json({
      message: "Complaint created successfully",
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create complaint"
    });
  }
});

export default router;