import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all complaints
router.get("/", authenticateToken, async (req, res) => {
  try {
    let complaints;

    if (String(req.user.role).toUpperCase() === "STUDENT") {
      const student = await db.orm.public.Student.first({
        userId: req.user.userId
      });

      if (!student) {
        return res.status(404).json({
          message: "Student profile not found"
        });
      }

      complaints = await db.orm.public.Complaint
        .where({ studentId: student.id })
        .all();
        } else if (String(req.user.role).toUpperCase() === "TEACHER") {
      complaints = await db.orm.public.Complaint.all();
    } else {
      return res.status(403).json({
        message: "Access denied"
      });
    }

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
      section,
      category,
      title,
      description
    } = req.body;

    if (!section || !category || !title?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "All complaint fields are required"
      });
    }

    const student = await db.orm.public.Student.first({
      userId: req.user.userId
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    const complaint = await db.orm.public.Complaint.create({
      studentId: student.id,
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

// UPDATE complaint status
router.patch("/:id/status", authenticateToken, async (req, res) => {
  if (String(req.user.role).toUpperCase() !== "TEACHER") {
  return res.status(403).json({
    message: "Only teachers can update complaint status"
  });
}

  try {
    const complaintId = Number(req.params.id);
    const { status } = req.body;

    if (!["PENDING", "IN_PROGRESS", "RESOLVED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status"
      });
    }

    const complaint = await db.orm.public.Complaint
      .where({ id: complaintId })
      .update({
        status,
        resolvedAt: status === "RESOLVED" ? new Date() : null
      });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.json({
      message: "Complaint status updated successfully",
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update complaint status"
    });
  }
});

// DELETE complaint
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const complaintId = Number(req.params.id);

    const complaint = await db.orm.public.Complaint.first({
      id: complaintId
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    if (String(req.user.role).toUpperCase() === "STUDENT") {
  const student = await db.orm.public.Student.first({
    userId: req.user.userId
  });

  if (!student || complaint.studentId !== student.id) {
    return res.status(403).json({
      message: "You can only delete your own complaints"
    });
  }
} else if (String(req.user.role).toUpperCase() !== "TEACHER") {
  return res.status(403).json({
    message: "Access denied"
  });
}

    const deletedComplaint = await db.orm.public.Complaint
      .where({ id: complaintId })
      .delete();

    res.json({
      message: "Complaint deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete complaint"
    });
  }
});

export default router;