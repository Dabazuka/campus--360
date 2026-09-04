import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all doubts
router.get("/", authenticateToken, async (req, res) => {
  try {
    const doubts = await db.orm.public.Doubt.all();
    const students = await db.orm.public.Student.all();
    const subjects = await db.orm.public.Subject.all();

    for (const doubt of doubts) {
      const student = students.find(s => s.id === doubt.studentId);
      const subject = subjects.find(s => s.id === doubt.subjectId);

      doubt.student = student?.name || "Unknown Student";
      doubt.subject = subject?.name || "Unknown Subject";

      doubt.replies = await db.orm.public.Reply
        .where({ doubtId: doubt.id })
        .all();
    }

    res.json({ doubts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch doubts" });
  }
});

// CREATE a new doubt
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { subjectId, question } = req.body;

    const student = await db.orm.public.Student.first({
      userId: req.user.userId
    });
    
    if (!student) {
        return res.status(404).json({
          message: "Student profile not found"
      });
    }

    if (!subjectId || !question?.trim()) {
      return res.status(400).json({
        message: "Student, subject, and question are required"
      });
    }

    const studentSubject = await db.orm.public.StudentSubject.first({
      studentId: student.id,
      subjectId: Number(subjectId)
    });

  if (!studentSubject) {
    return res.status(403).json({
    message: "You are not enrolled in this subject"
    });
  }

    const doubt = await db.orm.public.Doubt.create({
      studentId: student.id,
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

// CREATE a reply
router.post("/:doubtId/replies", authenticateToken, async (req, res) => {
  try {
    const doubtId = Number(req.params.doubtId);
    const doubt = await db.orm.public.Doubt.first({
  id: doubtId
});

if (!doubt) {
  return res.status(404).json({
    message: "Doubt not found"
  });
}

    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Reply message is required"
      });
    }

    const reply = await db.orm.public.Reply.create({
      doubtId,
      authorId: req.user.userId,
      message: message.trim()
    });

    res.status(201).json({
      message: "Reply added successfully",
      reply
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add reply"
    });
  }
});

router.delete("/:doubtId", authenticateToken, async (req, res) => {
  if (String(req.user.role).toUpperCase() !== "TEACHER") {
  return res.status(403).json({
    message: "Only teachers can delete doubts"
  });
}

  try {
    const doubtId = Number(req.params.doubtId);

    await db.orm.public.Reply
      .where({ doubtId })
      .delete();

    const deletedDoubt = await db.orm.public.Doubt
      .where({ id: doubtId })
      .delete();

    if (!deletedDoubt) {
      return res.status(404).json({
        message: "Doubt not found"
      });
    }

    res.json({
      message: "Doubt deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete doubt"
    });
  }
});

export default router;