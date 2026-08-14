import type { FastifyInstance } from "fastify";
import { prisma, DocumentType } from "@doc-vault/db";
import { REQUIRED_ADULT_DOCUMENTS, type DashboardStats, type DocumentSummary } from "@doc-vault/shared";

function toSummary(doc: {
  id: string;
  title: string;
  type: DocumentType;
  personId: string;
  expiryDate: Date | null;
  isFavorite: boolean;
  inTravelPack: boolean;
  person: { name: string };
}): DocumentSummary {
  return {
    id: doc.id,
    title: doc.title,
    type: doc.type as DocumentSummary["type"],
    personId: doc.personId,
    personName: doc.person.name,
    expiryDate: doc.expiryDate?.toISOString() ?? null,
    isFavorite: doc.isFavorite,
    inTravelPack: doc.inTravelPack,
  };
}

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (request) => {
    const userId = request.user.sub;
    const now = new Date();
    const in90Days = new Date();
    in90Days.setDate(in90Days.getDate() + 90);

    const [persons, documents, favoritesCount, travelPackCount] = await Promise.all([
      prisma.person.findMany({ where: { userId }, include: { documents: true } }),
      prisma.document.findMany({
        where: { userId },
        include: { person: true },
      }),
      prisma.document.count({ where: { userId, isFavorite: true } }),
      prisma.document.count({ where: { userId, inTravelPack: true } }),
    ]);

    const expiringSoon = documents
      .filter((d) => d.expiryDate && d.expiryDate >= now && d.expiryDate <= in90Days)
      .map(toSummary);

    const expired = documents.filter((d) => d.expiryDate && d.expiryDate < now).map(toSummary);

    const missingByPerson = persons.map((person) => {
      const existingTypes = new Set(person.documents.map((d) => d.type));
      const missingTypes = REQUIRED_ADULT_DOCUMENTS.filter((t) => !existingTypes.has(t as DocumentType));
      return {
        personId: person.id,
        personName: person.name,
        missingTypes: missingTypes as DocumentSummary["type"][],
      };
    }).filter((m) => m.missingTypes.length > 0);

    const stats: DashboardStats = {
      totalDocuments: documents.length,
      totalPersons: persons.length,
      expiringSoon,
      expired,
      missingByPerson,
      favoritesCount,
      travelPackCount,
    };

    return stats;
  });
}
