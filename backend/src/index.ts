import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadConfig } from "./lib/config.js";
import { registerAuthRoutes } from "./routes/auth.js";
import { registerAdminRoutes } from "./routes/admin.js";

async function build() {
  const config = loadConfig();
  const app = Fastify({ logger: true, trustProxy: true });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await registerAuthRoutes(app, config);
  await registerAdminRoutes(app, config);

  return app;
}

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

build()
  .then(async (app) => {
    await app.listen({ port, host });
    console.log(`ptoe API listening on http://${host}:${port}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
