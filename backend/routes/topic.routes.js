import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createTopic,
  getTopicsBySubject,
  getTopicById,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

const router = express.Router();

// CREATE
router.post("/", protect, authorize("admin"), createTopic);

// READ

// ✅ SUPPORT BOTH ROUTES (BEST PRACTICE)
router.get("/subject/:subjectId", getTopicsBySubject);
router.get("/subjects/:subjectId/topics", getTopicsBySubject);

router.get("/:id", getTopicById);

// UPDATE & DELETE
router.put("/:id", protect, authorize("admin"), updateTopic);
router.delete("/:id", protect, authorize("admin"), deleteTopic);

export default router;