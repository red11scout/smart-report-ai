import { defineConfig } from "drizzle-kit";

const url = process.env.NEON_DB_URL || process.env.DATABASE_URL;

if (!url) {
  throw new Error("Database URL not configured. Set NEON_DB_URL or DATABASE_URL.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
