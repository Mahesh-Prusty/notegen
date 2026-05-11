import express from "express";
import mongoose from "mongoose";
import Note from "../models/Note.js";
import Topic from "../models/Topic.js";
import Subject from "../models/Subject.js";

const router = express.Router();

// 🔥 Helper functions
function getRandomOne(arr) {
if (!arr || arr.length === 0) return null;
return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItems(arr, count) {
if (!arr || arr.length === 0) return [];

const shuffled = [...arr];
for (let i = shuffled.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}

return shuffled.slice(0, count);
}

// POST /api/filter-notes
router.post("/filter-notes", async (req, res) => {
try {
const { subjectId, topicId, classLevel } = req.body; // ✅ FIX

if (!subjectId || !topicId || !classLevel) {
  return res.status(400).json({ message: "All fields required" });
}

// 1️⃣ Validate IDs
if (
  !mongoose.Types.ObjectId.isValid(subjectId) ||
  !mongoose.Types.ObjectId.isValid(topicId)
) {
  return res.status(400).json({ message: "Invalid IDs" });
}

// 2️⃣ Find topic
const topicDoc = await Topic.findOne({
  _id: topicId,
  subjectId: subjectId,
});

if (!topicDoc) return res.json([]);

// 3️⃣ Find notes
const notes = await Note.find({
  topicId: topicId,
  classLevel: Number(classLevel),
});

// 🔥 SAME LOGIC (unchanged)
const randomizedNotes = notes.map((note) => ({
  _id: note._id,
  title: note.title,
  classLevel: note.classLevel,

  definition: getRandomOne(note.definitions),
  examples: getRandomItems(
    note.examples,
    Math.min(2, note.examples.length)
  ),
  questions: getRandomItems(
    note.questions,
    Math.min(3, note.questions.length)
  ),

  tags: note.tags,
  diagrams: note.diagrams,
}));

res.json(randomizedNotes);

} catch (error) {
console.error(error);
res.status(500).json({ message: "Server error" });
}
});

export default router;