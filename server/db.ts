import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema";

function getDatabaseUrl(): string {
  // Priority 1: Use NEON_DB_URL if available
  if (process.env.NEON_DB_URL) {
    const url = process.env.NEON_DB_URL.trim();
    if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
      return url;
    }
  }

  // Priority 2: Fall back to DATABASE_URL
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  throw new Error(
    "Database URL not configured. Set NEON_DB_URL or DATABASE_URL.",
  );
}

const databaseUrl = getDatabaseUrl();
const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
