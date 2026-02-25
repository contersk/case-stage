import "dotenv/config";

const prismaConfig = {
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
