import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Cloudinary / S3 URL
  caption: { type: String },
  type: {
    type: String,
    enum: ["image", "diagram"],
    default: "image",
  },
});

const noteSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    classLevel: {
      type: Number,
      enum: [6, 7, 8, 9, 10, 11, 12],
      required: true,
    },

    definitions: {
      type: [String],
      required: true,
    },

    examples: {
      type: [String],
      default: [],
    },

    questions: {
      type: [String],
      default: [],
    },

    diagrams: [mediaSchema], // standalone diagrams

    tags: [String], // useful for filtering
  },
  { timestamps: true },
);

export default mongoose.model("Note", noteSchema);
