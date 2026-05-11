import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createNote,
  getNotesByTopic,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createNote);
router.get("/topic/:topicId", getNotesByTopic);

router.get("/:id", getNoteById);
router.put("/:id", protect, authorize("admin"), updateNote);
router.delete("/:id", protect, authorize("admin"), deleteNote);

export default router;