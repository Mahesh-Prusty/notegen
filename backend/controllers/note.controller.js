import mongoose from "mongoose";
import Note from "../models/Note.js";
import Topic from "../models/Topic.js";

// 🔹 Random multiple items
function getRandomItems(arr, count) {
  if (!arr || arr.length === 0) return [];

  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 🔹 Random single item
function getRandomOne(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===============================
// CREATE NOTE
// ===============================
export const createNote = async (req, res) => {
  try {
    const { topicId } = req.body;

    const { title, classLevel, definitions, examples, questions, order } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    if (!title || !Array.isArray(definitions) || definitions.length === 0) {
      return res.status(400).json({
        message: "Title and definitions are required",
      });
    }

    const note = await Note.create({
      topicId,
      title,
      classLevel,
      definitions,
      examples: examples || [],
      questions: questions || [],
      order,
    });

    return res.status(201).json(note);
  } catch (error) {
    console.error("[createNote]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===============================
// GET NOTES BY TOPIC (AI MAGIC)
// ===============================
export const getNotesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    const notes = await Note.find({ topicId }).sort({ order: 1 }).lean();

    const randomizedNotes = notes.map((note) => {
      const definitions = note.definitions || [];
      const examples = note.examples || [];
      const questions = note.questions || [];

      const definition = getRandomOne(definitions);
      const example = getRandomOne(examples);

      // 🔥 AI-like combined output
      const combinedDefinition = example
        ? `${definition} For example, ${example}.`
        : definition;

      const exampleCount = Math.floor(Math.random() * 2) + 1;
      const questionCount = Math.floor(Math.random() * 3) + 1;

      delete note.definitions;

      return {
        ...note,
        definition: combinedDefinition,
        examples: getRandomItems(examples, exampleCount),
        questions: getRandomItems(questions, questionCount),
      };
    });

    return res.status(200).json(randomizedNotes);
  } catch (error) {
    console.error("[getNotesByTopic]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===============================
// GET SINGLE NOTE
// ===============================
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id).lean();
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const definitions = note.definitions || [];
    delete note.definitions;

    return res.status(200).json({
      ...note,
      definition: getRandomOne(definitions),
    });
  } catch (error) {
    console.error("[getNoteById]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===============================
// UPDATE NOTE
// ===============================
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { topicId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    const existingNote = await Note.findById(id);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (existingNote.topicId.toString() !== topicId) {
      return res.status(403).json({
        message: "Note does not belong to this topic",
      });
    }

    const {
      title,
      slug,
      definitions,
      order,
      isPublished,
      estimatedReadTime,
      examples,
      questions,
      tags,
      diagrams,
    } = req.body;

    const note = await Note.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        definitions,
        order,
        isPublished,
        estimatedReadTime,
        examples,
        questions,
        tags,
        diagrams,
      },
      { new: true, runValidators: true },
    );

    return res.status(200).json(note);
  } catch (error) {
    console.error("[updateNote]", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate note data" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===============================
// DELETE NOTE
// ===============================
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { topicId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Invalid topic ID" });
    }

    const existingNote = await Note.findById(id);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!topicId || existingNote.topicId.toString() !== topicId) {
      return res.status(403).json({
        message: "Note does not belong to this topic",
      });
    }

    await Note.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("[deleteNote]", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
