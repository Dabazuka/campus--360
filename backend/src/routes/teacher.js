import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();


// GET all students
router.get("/students", authenticateToken, async (req, res) => {
    if (String(req.user.role).toUpperCase() !== "TEACHER") {
    return res.status(403).json({
        message: "Only teachers can view all students"
    });
}

    try {
        const students = await db.orm.public.Student.all();

        res.json({
            students
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch students"
        });
    }
});


// UPDATE student
router.put("/students/:id", authenticateToken, async (req, res) => {
    if (String(req.user.role).toUpperCase() !== "TEACHER") {
  return res.status(403).json({
    message: "Only teachers can update students"
  });
}

    try {
        const studentId = Number(req.params.id);

        const {
            classMarks,
            yearlyCgpa,
            assignmentSubmitted
        } = req.body;

        const updatedStudent =
            await db.orm.public.Student
                .where({ id: studentId })
                .update({
                    classMarks: Number(classMarks),
                    yearlyCgpa: Number(yearlyCgpa),
                    assignmentSubmitted: Boolean(assignmentSubmitted)
                });

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully",
            student: updatedStudent
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update student"
        });
    }
});

// CREATE student
router.post("/students", authenticateToken, async (req, res) => {
    if (String(req.user.role).toUpperCase() !== "TEACHER") {
  return res.status(403).json({
    message: "Only teachers can create students"
  });
}

    try {
        const {
            loginId,
            password,
            studentId,
            name,
            section,
            classMarks,
            yearlyCgpa,
            assignmentSubmitted
        } = req.body;

        if (
    !loginId ||
    !password ||
    !studentId ||
    !name?.trim() ||
    !section
) {
    return res.status(400).json({
        message: "All student fields are required"
    });
}

const marks = Number(classMarks);
const cgpa = Number(yearlyCgpa);

if (
    !Number.isFinite(marks) ||
    !Number.isFinite(cgpa) ||
    marks < 0 ||
    marks > 100 ||
    cgpa < 0 ||
    cgpa > 10
) {
    return res.status(400).json({
        message: "Invalid marks or CGPA"
    });
}

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await db.orm.public.User.create({
            loginId,
            passwordHash,
            role: "STUDENT"
        });

        const student = await db.orm.public.Student.create({
            userId: user.id,
            studentId,
            name,
            section,
            classMarks: marks,
            yearlyCgpa: cgpa,
            assignmentSubmitted: Boolean(assignmentSubmitted)
        });

        const subjects = await db.orm.public.Subject.all();

        for (const subject of subjects) {
            
            await db.orm.public.StudentSubject.create({
                studentId: student.id,
                subjectId: subject.id,
                classesAttended: 0,
                classesTotal: 0,
                grade: "N/A"
            });
        }

        res.status(201).json({
            message: "Student created successfully",
            student
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create student"
        });
    }
});

export default router;