import express from "express";
import { db } from "../prisma/db.ts";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all notices
router.get("/", authenticateToken, async (req, res) => {
  try {
    const notices = await db.orm.public.Notice.all();

    const formattedNotices = notices.map((notice) => ({
      ...notice,
    author: "Teacher / Faculty Admin",
    date: notice.createdAt
  }));

    res.json({ notices: formattedNotices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notices" });
  }
});

// CREATE notice
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, category, description, urgent } = req.body;

    const notice = await db.orm.public.Notice.create({
      title,
      category,
      description,
      urgent,
      authorId: req.user.userId
    });

    res.status(201).json({
      message: "Notice created successfully",
      notice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create notice" });
  }
});

// DELETE notice
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const noticeId = Number(req.params.id);

    const deletedNotice = await db.orm.public.Notice
      .where({ id: noticeId })
      .delete();

    if (!deletedNotice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json({
      message: "Notice deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete notice" });
  }
});

export default router;