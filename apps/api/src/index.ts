import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { buildApp } from "./app";

const port = Number(process.env.API_PORT ?? 4000);

// Resolve relative storage paths from monorepo root (not apps/api cwd)
if (process.env.STORAGE_PATH && !path.isAbsolute(process.env.STORAGE_PATH)) {
  process.env.STORAGE_PATH = path.resolve(__dirname, "../../../", process.env.STORAGE_PATH);
} else if (!process.env.STORAGE_PATH) {
  process.env.STORAGE_PATH = path.resolve(__dirname, "../../../uploads");
}

async function main() {
  const app = await buildApp();
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`API listening on http://localhost:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
