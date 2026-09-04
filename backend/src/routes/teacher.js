import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();


// GET all students
router.get("/students", authenticateToken, async (req, res) => {
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
            classMarks: Number(classMarks),
            yearlyCgpa: Number(yearlyCgpa),
            assignmentSubmitted: Boolean(assignmentSubmitted)
        });

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