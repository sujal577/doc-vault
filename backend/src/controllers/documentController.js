import * as documentService from "../services/documentService.js";
import { sendSuccess } from "../utils/response.js";

export async function listUserDocuments(req, res) {
  const documents = await documentService.listDocumentsForUser(req.params.userId);
  sendSuccess(res, documents);
}

export async function listMemberDocuments(req, res) {
  const documents = await documentService.listDocumentsForMember(
    req.params.memberId,
    req.query.userId,
  );
  sendSuccess(res, documents);
}

export async function getDocument(req, res) {
  const document = await documentService.getDocumentById(req.params.documentId);
  sendSuccess(res, document);
}
