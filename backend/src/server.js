import express from "express";
import cors from "cors";
import "dotenv/config";
import { db } from "./prisma/db.ts";
import authRouter from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";
import studentRouter from "./routes/student.js";
import teacherRouter from "./routes/teacher.js";
import eventRoutes from "./routes/events.js";
import noticeRoutes from "./routes/notices.js";
import doubtRoutes from "./routes/doubts.js";
import complaintRoutes from "./routes/complaints.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/events", eventRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Campus 360 API is running!"
    });
});

app.get("/api/protected-test", authenticateToken, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});