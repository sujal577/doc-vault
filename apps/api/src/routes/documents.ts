import type { FastifyInstance } from "fastify";
import { prisma, DocumentType } from "@doc-vault/db";
import {
  createDocumentSchema,
  updateDocumentSchema,
  compareQuerySchema,
  uploadVersionSchema,
} from "@doc-vault/shared";
import {
  decryptMetadata,
  encryptMetadata,
  encryptOcrText,
  readEncryptedFile,
  saveEncryptedFile,
} from "../services/storage";
import { runOcr } from "../services/ocr";
import { syncRemindersForDocument } from "../services/reminders";

function mapDocument(doc: {
  id: string;
  personId: string;
  type: DocumentType;
  title: string;
  metadataEnc: string;
  isFavorite: boolean;
  inTravelPack: boolean;
  expiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  person?: { name: string };
  tags?: { tag: { id: string; name: string } }[];
  versions?: {
    id: string;
    year: number;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: Date;
  }[];
}) {
  return {
    id: doc.id,
    personId: doc.personId,
    personName: doc.person?.name,
    type: doc.type,
    title: doc.title,
    metadata: decryptMetadata(doc.metadataEnc),
    isFavorite: doc.isFavorite,
    inTravelPack: doc.inTravelPack,
    expiryDate: doc.expiryDate?.toISOString() ?? null,
    tags: doc.tags?.map((t) => t.tag) ?? [],
    versions:
      doc.versions?.map((v) => ({
        id: v.id,
        year: v.year,
        fileName: v.fileName,
        mimeType: v.mimeType,
        sizeBytes: v.sizeBytes,
        uploadedAt: v.uploadedAt.toISOString(),
      })) ?? [],
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function upsertTags(userId: string, tagNames: string[]) {
  const tags = [];
  for (const name of tagNames) {
    const normalized = name.trim().toLowerCase();
    if (!normalized) continue;
    const tag = await prisma.tag.upsert({
      where: { userId_name: { userId, name: normalized } },
      update: {},
      create: { userId, name: normalized },
    });
    tags.push(tag);
  }
  return tags;
}

export async function documentRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (request) => {
    const { personId, type, favorite, travelPack } = request.query as Record<string, string | undefined>;
    const docs = await prisma.document.findMany({
      where: {
        userId: request.user.sub,
        ...(personId ? { personId } : {}),
        ...(type ? { type: type as DocumentType } : {}),
        ...(favorite === "true" ? { isFavorite: true } : {}),
        ...(travelPack === "true" ? { inTravelPack: true } : {}),
      },
      include: {
        person: true,
        tags: { include: { tag: true } },
        versions: { orderBy: { year: "desc" } },
      },
      orderBy: { updatedAt: "desc" },
    });
    return docs.map(mapDocument);
  });

  app.post("/", async (request, reply) => {
    const body = createDocumentSchema.parse(request.body);
    const person = await prisma.person.findFirst({
      where: { id: body.personId, userId: request.user.sub },
    });
    if (!person) return reply.code(404).send({ error: "Person not found" });

    const tags = await upsertTags(request.user.sub, body.tagNames);
    const doc = await prisma.document.create({
      data: {
        userId: request.user.sub,
        personId: body.personId,
        type: body.type,
        title: body.title,
        metadataEnc: encryptMetadata(body.metadata),
        isFavorite: body.isFavorite,
        inTravelPack: body.inTravelPack,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
        tags: { create: tags.map((t) => ({ tagId: t.id })) },
      },
      include: { person: true, tags: { include: { tag: true } }, versions: true },
    });

    await syncRemindersForDocument(request.user.sub, doc.id, doc.expiryDate);
    return reply.code(201).send(mapDocument(doc));
  });

  app.get("/compare", async (request, reply) => {
    const { ids } = compareQuerySchema.parse(request.query);
    const docs = await prisma.document.findMany({
      where: { id: { in: ids }, userId: request.user.sub },
      include: {
        person: true,
        tags: { include: { tag: true } },
        versions: { orderBy: { year: "desc" }, take: 1 },
      },
    });
    if (docs.length < 2) {
      return reply.code(404).send({ error: "Need at least 2 documents to compare" });
    }
    return docs.map(mapDocument);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const doc = await prisma.document.findFirst({
      where: { id, userId: request.user.sub },
      include: {
        person: true,
        tags: { include: { tag: true } },
        versions: { orderBy: { year: "desc" } },
      },
    });
    if (!doc) return reply.code(404).send({ error: "Document not found" });
    return mapDocument(doc);
  });

  app.patch("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateDocumentSchema.parse(request.body);
    const existing = await prisma.document.findFirst({
      where: { id, userId: request.user.sub },
    });
    if (!existing) return reply.code(404).send({ error: "Document not found" });

    if (body.tagNames) {
      await prisma.documentTag.deleteMany({ where: { documentId: id } });
      const tags = await upsertTags(request.user.sub, body.tagNames);
      await prisma.documentTag.createMany({
        data: tags.map((t) => ({ documentId: id, tagId: t.id })),
      });
    }

    const doc = await prisma.document.update({
      where: { id },
      data: {
        type: body.type,
        title: body.title,
        metadataEnc: body.metadata ? encryptMetadata(body.metadata) : undefined,
        isFavorite: body.isFavorite,
        inTravelPack: body.inTravelPack,
        expiryDate: body.expiryDate !== undefined ? (body.expiryDate ? new Date(body.expiryDate) : null) : undefined,
      },
      include: {
        person: true,
        tags: { include: { tag: true } },
        versions: { orderBy: { year: "desc" } },
      },
    });

    await syncRemindersForDocument(request.user.sub, doc.id, doc.expiryDate);
    return mapDocument(doc);
  });

  app.patch("/:id/favorite", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isFavorite } = request.body as { isFavorite: boolean };
    const existing = await prisma.document.findFirst({ where: { id, userId: request.user.sub } });
    if (!existing) return reply.code(404).send({ error: "Document not found" });
    const doc = await prisma.document.update({
      where: { id },
      data: { isFavorite: Boolean(isFavorite) },
      include: { person: true, tags: { include: { tag: true } }, versions: true },
    });
    return mapDocument(doc);
  });

  app.patch("/:id/travel-pack", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { inTravelPack } = request.body as { inTravelPack: boolean };
    const existing = await prisma.document.findFirst({ where: { id, userId: request.user.sub } });
    if (!existing) return reply.code(404).send({ error: "Document not found" });
    const doc = await prisma.document.update({
      where: { id },
      data: { inTravelPack: Boolean(inTravelPack) },
      include: { person: true, tags: { include: { tag: true } }, versions: true },
    });
    return mapDocument(doc);
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await prisma.document.findFirst({ where: { id, userId: request.user.sub } });
    if (!existing) return reply.code(404).send({ error: "Document not found" });
    await prisma.document.delete({ where: { id } });
    return reply.code(204).send();
  });

  app.post("/:id/versions", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const doc = await prisma.document.findFirst({ where: { id, userId: request.user.sub } });
      if (!doc) return reply.code(404).send({ error: "Document not found" });

      const data = await request.file();
      if (!data) return reply.code(400).send({ error: "File required" });

      const yearField = data.fields.year;
      const yearRaw = Array.isArray(yearField) ? yearField[0] : yearField;
      const yearValue = typeof yearRaw === "object" && yearRaw && "value" in yearRaw ? yearRaw.value : yearRaw;
      const { year } = uploadVersionSchema.parse({ year: yearValue ?? new Date().getFullYear() });

      const buffer = await data.toBuffer();
      if (!buffer.length) {
        return reply.code(400).send({ error: "Empty file" });
      }

      const relativeKey = `${request.user.sub}/${id}/${year}-${Date.now()}.enc`;
      const { key, checksum } = await saveEncryptedFile(relativeKey, buffer);

      // OCR must never fail the upload
      let ocrText = "";
      try {
        ocrText = await runOcr(buffer, data.mimetype);
      } catch (ocrErr) {
        request.log.warn({ err: ocrErr }, "OCR failed; continuing without OCR text");
      }
      const ocrTextEnc = ocrText ? encryptOcrText(ocrText) : null;

      const version = await prisma.documentVersion.upsert({
        where: { documentId_year: { documentId: id, year } },
        update: {
          fileKey: key,
          fileName: data.filename,
          mimeType: data.mimetype,
          sizeBytes: buffer.length,
          ocrTextEnc,
          checksum,
        },
        create: {
          documentId: id,
          year,
          fileKey: key,
          fileName: data.filename,
          mimeType: data.mimetype,
          sizeBytes: buffer.length,
          ocrTextEnc,
          checksum,
        },
      });

      return reply.code(201).send({
        id: version.id,
        year: version.year,
        fileName: version.fileName,
        mimeType: version.mimeType,
        sizeBytes: version.sizeBytes,
        uploadedAt: version.uploadedAt.toISOString(),
        ocrExtracted: Boolean(ocrText),
      });
    } catch (err) {
      request.log.error(err);
      const message = err instanceof Error ? err.message : "Upload failed";
      if (message.includes("VAULT_MASTER_KEY")) {
        return reply.code(500).send({ error: "Encryption key misconfigured (VAULT_MASTER_KEY)" });
      }
      return reply.code(500).send({ error: message });
    }
  });

  app.get("/:id/versions/:versionId/download", async (request, reply) => {
    const { id, versionId } = request.params as { id: string; versionId: string };
    const version = await prisma.documentVersion.findFirst({
      where: { id: versionId, document: { id, userId: request.user.sub } },
    });
    if (!version) return reply.code(404).send({ error: "Version not found" });

    const buffer = await readEncryptedFile(version.fileKey);
    return reply
      .header("Content-Type", version.mimeType)
      .header("Content-Disposition", `inline; filename="${version.fileName}"`)
      .send(buffer);
  });
}
