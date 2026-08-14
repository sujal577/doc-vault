import type { FastifyInstance } from "fastify";
import { prisma } from "@doc-vault/db";

export async function reminderRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (request) => {
    const reminders = await prisma.reminder.findMany({
      where: { userId: request.user.sub },
      include: {
        document: { include: { person: true } },
      },
      orderBy: { remindAt: "asc" },
    });

    return reminders.map((r) => ({
      id: r.id,
      documentId: r.documentId,
      documentTitle: r.document.title,
      personName: r.document.person.name,
      remindAt: r.remindAt.toISOString(),
      daysBefore: r.daysBefore,
      sent: r.sent,
    }));
  });
}
