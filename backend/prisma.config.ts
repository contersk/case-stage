import "dotenv/config";

const prismaConfig = {
  schema: "./src/server/database/prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Use local SQLite for migrations
    url: process.env.DATABASE_URL,
  },
};

export default prismaConfig;
