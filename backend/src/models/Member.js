import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    relationship: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

memberSchema.index({ userId: 1, name: 1, relationship: 1 }, { unique: true });

export const Member = mongoose.model("Member", memberSchema);
