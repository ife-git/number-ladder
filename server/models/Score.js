import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    rungsFilled: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },
    timeInSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    skips: {
      type: Number,
      required: true,
      min: 0,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }, // This automatically adds createdAt and updatedAt
);

// Add an index for faster sorting
scoreSchema.index({ score: -1 });
scoreSchema.index({ createdAt: -1 });

export default mongoose.model("Score", scoreSchema);
