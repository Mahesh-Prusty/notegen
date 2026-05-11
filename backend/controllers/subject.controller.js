import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";
import Note from "../models/Note.js";

// CREATE SUBJECT
export const createSubject = async (req, res) => {
  try {
    const { name, classLevel, code, board, description, isActive } = req.body;

    if (!name || !classLevel) {
      return res.status(400).json({ message: "Name and classLevel are required" });
    }

    if (classLevel < 1 || classLevel > 12) {
      return res.status(400).json({ message: "classLevel must be between 1 and 12" });
    }

    const subject = await Subject.create({
      name, classLevel, code, board, description, isActive,
    });

    return res.status(201).json(subject);
  } catch (error) {
    console.error("[createSubject]", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Subject with this name or code already exists" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL SUBJECTS
export const getAllSubjects = async (req, res) => {
  try {
    // FIX: sort by classLevel then name — makes more sense for an education app
    const subjects = await Subject.find().sort({ classLevel: 1, name: 1 });
    return res.status(200).json(subjects);
  } catch (error) {
    console.error("[getAllSubjects]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET SINGLE SUBJECT
export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.status(200).json(subject);
  } catch (error) {
    console.error("[getSubjectById]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE SUBJECT
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    // FIX: whitelist allowed fields — prevent clients from overwriting internal fields
    const { name, classLevel, code, board, description, isActive } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      id,
      { name, classLevel, code, board, description, isActive },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.status(200).json(subject);
  } catch (error) {
    console.error("[updateSubject]", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate subject data" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE SUBJECT
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // FIX: cascade delete — remove all topics and their notes under this subject
    const topics = await Topic.find({ subjectId: id });
    const topicIds = topics.map((t) => t._id);
    await Note.deleteMany({ topicId: { $in: topicIds } });
    await Topic.deleteMany({ subjectId: id });

    return res.status(200).json({ message: "Subject and all related topics and notes deleted" });
  } catch (error) {
    console.error("[deleteSubject]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};