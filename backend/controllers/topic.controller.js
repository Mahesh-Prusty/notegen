import mongoose from "mongoose";
import Topic from "../models/Topic.js";
import Subject from "../models/Subject.js";
import Note from "../models/Note.js";

// CREATE TOPIC
export const createTopic = async (req, res) => {
  try {
    const { subjectId } = req.body;
    const { title, slug, description, order, difficulty, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const topic = await Topic.create({
      subjectId, title, slug, description, order, difficulty, isActive,
    });

    return res.status(201).json(topic);
  } catch (error) {
    console.error("[createTopic]", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Topic with this title already exists in this subject" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL TOPICS UNDER SUBJECT
export const getTopicsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const topics = await Topic.find({ subjectId }).sort({ order: 1 });
    return res.status(200).json(topics);
  } catch (error) {
    console.error("[getTopicsBySubject]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET SINGLE TOPIC
export const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    return res.status(200).json(topic);
  } catch (error) {
    console.error("[getTopicById]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE TOPIC
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    // FIX: whitelist allowed fields — prevent overwriting subjectId
    const { title, slug, description, order, difficulty, isActive } = req.body;

    const topic = await Topic.findByIdAndUpdate(
      id,
      { title, slug, description, order, difficulty, isActive },
      { new: true, runValidators: true }
    );

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    return res.status(200).json(topic);
  } catch (error) {
    console.error("[updateTopic]", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate topic data" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE TOPIC
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // FIX: cascade delete — remove all notes under this topic
    await Note.deleteMany({ topicId: id });

    return res.status(200).json({ message: "Topic and all its notes deleted" });
  } catch (error) {
    console.error("[deleteTopic]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};