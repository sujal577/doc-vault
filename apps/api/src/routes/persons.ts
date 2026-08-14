import type { FastifyInstance } from "fastify";
import { prisma } from "@doc-vault/db";
import { createPersonSchema, updatePersonSchema } from "@doc-vault/shared";

export async function personRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (request) => {
    const persons = await prisma.person.findMany({
      where: { userId: request.user.sub },
      include: { _count: { select: { documents: true } } },
      orderBy: { createdAt: "asc" },
    });
    return persons.map((p) => ({
      id: p.id,
      name: p.name,
      relation: p.relation,
      dob: p.dob?.toISOString() ?? null,
      documentCount: p._count.documents,
    }));
  });

  app.post("/", async (request, reply) => {
    const body = createPersonSchema.parse(request.body);
    const person = await prisma.person.create({
      data: {
        userId: request.user.sub,
        name: body.name,
        relation: body.relation,
        dob: body.dob ? new Date(body.dob) : undefined,
      },
    });
    return reply.code(201).send({
      id: person.id,
      name: person.name,
      relation: person.relation,
      dob: person.dob?.toISOString() ?? null,
    });
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const person = await prisma.person.findFirst({
      where: { id, userId: request.user.sub },
      include: { documents: { include: { tags: { include: { tag: true } } } } },
    });
    if (!person) return reply.code(404).send({ error: "Person not found" });
    return person;
  });

  app.patch("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updatePersonSchema.parse(request.body);
    const existing = await prisma.person.findFirst({ where: { id, userId: request.user.sub } });
    if (!existing) return reply.code(404).send({ error: "Person not found" });

    const person = await prisma.person.update({
      where: { id },
      data: {
        name: body.name,
        relation: body.relation,
        dob: body.dob ? new Date(body.dob) : undefined,
      },
    });
    return {
      id: person.id,
      name: person.name,
      relation: person.relation,
      dob: person.dob?.toISOString() ?? null,
    };
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await prisma.person.findFirst({ where: { id, userId: request.user.sub } });
    if (!existing) return reply.code(404).send({ error: "Person not found" });
    await prisma.person.delete({ where: { id } });
    return reply.code(204).send();
  });
}
