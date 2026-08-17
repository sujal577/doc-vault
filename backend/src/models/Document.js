import mongoose from "mongoose";

const DOCUMENT_STATUSES = ["uploaded", "processing", "ready", "failed"];

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    documentType: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: DOCUMENT_STATUSES,
      default: "uploaded",
    },
    storageKey: {
      type: String,
      default: null,
      trim: true,
    },
    mimeType: {
      type: String,
      default: null,
      trim: true,
    },
    fileSize: {
      type: Number,
      default: null,
      min: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Document = mongoose.model("Document", documentSchema);
export { DOCUMENT_STATUSES };
