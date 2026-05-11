import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    code: {
      type: String,
      uppercase: true,
      unique: true,
      sparse: true,
    },

    classLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    board: {
      type: String,
      enum: ["State", "CBSE", "ICSE", "IB"],
    },

    description: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

subjectSchema.index({ name: 1, classLevel: 1 }, { unique: true });

export default mongoose.model("Subject", subjectSchema);
