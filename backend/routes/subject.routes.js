import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createSubject);
router.put("/:id", protect, authorize("admin"), updateSubject);
router.delete("/:id", protect, authorize("admin"), deleteSubject);
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);

export default router;
