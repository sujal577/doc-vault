import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as userController from "../controllers/userController.js";
import * as memberController from "../controllers/memberController.js";
import * as documentController from "../controllers/documentController.js";
import { validateObjectId, requireBodyFields, requireQueryFields } from "../middleware/validate.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Doc Vault API is running",
  });
});

router.get(
  "/users/:userId",
  validateObjectId("userId"),
  asyncHandler(userController.getUser),
);

router.get(
  "/users/:userId/members",
  validateObjectId("userId"),
  asyncHandler(memberController.listMembers),
);

router.post(
  "/users/:userId/members",
  validateObjectId("userId"),
  requireBodyFields("name", "relationship"),
  asyncHandler(memberController.createMember),
);

router.get(
  "/users/:userId/documents",
  validateObjectId("userId"),
  asyncHandler(documentController.listUserDocuments),
);

router.get(
  "/members/:memberId",
  validateObjectId("memberId"),
  asyncHandler(memberController.getMember),
);

router.patch(
  "/members/:memberId",
  validateObjectId("memberId"),
  requireQueryFields("userId"),
  validateObjectId("userId", "query"),
  asyncHandler(memberController.updateMember),
);

router.delete(
  "/members/:memberId",
  validateObjectId("memberId"),
  requireQueryFields("userId"),
  validateObjectId("userId", "query"),
  asyncHandler(memberController.deleteMember),
);

router.get(
  "/members/:memberId/documents",
  validateObjectId("memberId"),
  requireQueryFields("userId"),
  validateObjectId("userId", "query"),
  asyncHandler(documentController.listMemberDocuments),
);

router.get(
  "/documents/:documentId",
  validateObjectId("documentId"),
  asyncHandler(documentController.getDocument),
);

export default router;
