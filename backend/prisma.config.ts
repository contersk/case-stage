import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./src/server/database/prisma/schema.prisma",
  migrations: {
    path: "./src/server/database/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
