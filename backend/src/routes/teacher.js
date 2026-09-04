import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

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

export default router;