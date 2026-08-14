import type { FastifyInstance } from "fastify";
import { prisma, DocumentType, Prisma } from "@doc-vault/db";
import { searchQuerySchema } from "@doc-vault/shared";
import { decryptMetadata, decryptOcrText } from "../services/storage";

export async function searchRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (request) => {
    const query = searchQuerySchema.parse(request.query);
    const userId = request.user.sub;

    const where: Prisma.DocumentWhereInput = {
      userId,
      ...(query.type ? { type: query.type as DocumentType } : {}),
      ...(query.personId ? { personId: query.personId } : {}),
      ...(query.favorite ? { isFavorite: true } : {}),
      ...(query.travelPack ? { inTravelPack: true } : {}),
    };

    if (query.expiringWithinDays) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + query.expiringWithinDays);
      where.expiryDate = { lte: deadline, gte: new Date() };
    }

    if (query.tag) {
      where.tags = { some: { tag: { name: query.tag.toLowerCase() } } };
    }

    let docs = await prisma.document.findMany({
      where,
      include: {
        person: true,
        tags: { include: { tag: true } },
        versions: { orderBy: { year: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    if (query.q) {
      const q = query.q.toLowerCase();
      docs = docs.filter((doc) => {
        const meta = JSON.stringify(decryptMetadata(doc.metadataEnc)).toLowerCase();
        const ocr = doc.versions
          .map((v) => decryptOcrText(v.ocrTextEnc) ?? "")
          .join(" ")
          .toLowerCase();
        return (
          doc.title.toLowerCase().includes(q) ||
          doc.type.toLowerCase().includes(q) ||
          doc.person.name.toLowerCase().includes(q) ||
          meta.includes(q) ||
          ocr.includes(q) ||
          doc.tags.some((t) => t.tag.name.includes(q))
        );
      });
    }

    return docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      type: doc.type,
      personId: doc.personId,
      personName: doc.person.name,
      expiryDate: doc.expiryDate?.toISOString() ?? null,
      isFavorite: doc.isFavorite,
      inTravelPack: doc.inTravelPack,
      tags: doc.tags.map((t) => t.tag.name),
      latestYear: doc.versions[0]?.year ?? null,
    }));
  });
}
