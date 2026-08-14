import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { generateSalt } from "@doc-vault/crypto";
import { prisma } from "@doc-vault/db";
import { loginSchema, registerSchema } from "@doc-vault/shared";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return reply.code(409).send({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const vaultKeySalt = generateSalt();
    const user = await prisma.user.create({
      data: { email: body.email, passwordHash, vaultKeySalt },
    });

    if (body.name) {
      await prisma.person.create({
        data: { userId: user.id, name: body.name, relation: "self" },
      });
    }

    const accessToken = app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: "1h" });
    const refreshToken = app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: "7d" });

    return {
      user: { id: user.id, email: user.email, createdAt: user.createdAt.toISOString() },
      accessToken,
      refreshToken,
    };
  });

  app.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const accessToken = app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: "1h" });
    const refreshToken = app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: "7d" });

    return {
      user: { id: user.id, email: user.email, createdAt: user.createdAt.toISOString() },
      accessToken,
      refreshToken,
    };
  });

  app.get("/me", { preHandler: [app.authenticate] }, async (request) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.user.sub },
      select: { id: true, email: true, createdAt: true },
    });
    return { ...user, createdAt: user.createdAt.toISOString() };
  });
}
