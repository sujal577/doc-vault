import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { authRoutes } from "./routes/auth";
import { personRoutes } from "./routes/persons";
import { documentRoutes } from "./routes/documents";
import { searchRoutes } from "./routes/search";
import { dashboardRoutes } from "./routes/dashboard";
import { reminderRoutes } from "./routes/reminders";
import { startReminderWorker } from "./services/reminders";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; email: string };
    user: { sub: string; email: string };
  }
}

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin:
      process.env.NODE_ENV === "production"
        ? (process.env.CORS_ORIGIN?.split(",") ?? false)
        : true,
    credentials: true,
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me-min-32-characters-long",
  });

  await app.register(multipart, {
    limits: { fileSize: 25 * 1024 * 1024 },
  });

  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });

  app.get("/health", async () => ({ status: "ok", service: "doc-vault-api" }));

  app.setErrorHandler((err, _request, reply) => {
    if (err.name === "ZodError") {
      return reply.code(400).send({ error: "Invalid request data", details: (err as { issues?: unknown }).issues });
    }
    const message = err instanceof Error ? err.message : "Internal Server Error";
    if (message.includes("Can't reach database server") || message.includes("P1001")) {
      return reply.code(503).send({
        error: "Database unreachable. Start Postgres: pnpm docker:up then pnpm db:migrate && pnpm db:seed",
      });
    }
    if (message.includes("does not exist") || message.includes("P2021")) {
      return reply.code(503).send({
        error: "Database tables missing. Run: pnpm db:migrate && pnpm db:seed",
      });
    }
    app.log.error(err);
    return reply.code(500).send({ error: message });
  });

  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(personRoutes, { prefix: "/persons" });
  await app.register(documentRoutes, { prefix: "/documents" });
  await app.register(searchRoutes, { prefix: "/search" });
  await app.register(dashboardRoutes, { prefix: "/dashboard" });
  await app.register(reminderRoutes, { prefix: "/reminders" });

  startReminderWorker();

  return app;
}
