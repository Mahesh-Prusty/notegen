import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

topicSchema.index({ subjectId: 1, title: 1 }, { unique: true });

export default mongoose.model("Topic", topicSchema);