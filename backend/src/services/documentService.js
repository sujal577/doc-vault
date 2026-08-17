import { Document } from "../models/Document.js";
import { ApiError } from "../utils/ApiError.js";
import { getUserById } from "./userService.js";
import { ensureMemberBelongsToUser, getMemberById } from "./memberService.js";

export async function listDocumentsForUser(userId) {
  await getUserById(userId);
  return Document.find({ userId }).sort({ uploadedAt: -1 }).lean();
}

export async function listDocumentsForMember(memberId, userId) {
  await ensureMemberBelongsToUser(memberId, userId);
  return Document.find({ memberId, userId }).sort({ uploadedAt: -1 }).lean();
}

export async function getDocumentById(documentId) {
  const document = await Document.findById(documentId).lean();

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  return document;
}
