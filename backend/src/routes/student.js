import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/subjects", authenticateToken, async (req, res) => {
    try {
        const student = await db.orm.public.Student.first({
            userId: req.user.userId
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const studentSubjects = await db.orm.public.StudentSubject
            .where({
                studentId: student.id
            })
            .all();

        console.log("Student:", student);
        console.log("Student Subjects:", studentSubjects);

        const subjects = [];

        for (const studentSubject of studentSubjects) {
            const subject = await db.orm.public.Subject.first({
                id: studentSubject.subjectId
            });

            if (subject) {
                subjects.push({
                    id: subject.id,
                    name: subject.name,
                    attended: studentSubject.classesAttended,
                    total: studentSubject.classesTotal,
                    grade: studentSubject.grade
                });
            }
        }

        res.json({
            subjects
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch subjects"
        });
    }
});

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const student = await db.orm.public.Student.first({
            userId: req.user.userId
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.json({
            student
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch student profile"
        });
    }
});

export default router;