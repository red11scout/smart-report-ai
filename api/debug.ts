import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const results: Record<string, any> = {};

  // Check env vars
  results.envVars = {
    NEON_DB_URL: process.env.NEON_DB_URL ? `set (${process.env.NEON_DB_URL.length} chars)` : "NOT SET",
    DATABASE_URL: process.env.DATABASE_URL ? `set (${process.env.DATABASE_URL.length} chars)` : "NOT SET",
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? `set (${process.env.ANTHROPIC_API_KEY.length} chars)` : "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "NOT SET",
  };

  // Try importing neon
  try {
    const { neon } = await import("@neondatabase/serverless");
    results.neonImport = "ok";

    const url = process.env.NEON_DB_URL || process.env.DATABASE_URL;
    if (url) {
      const sql = neon(url);
      const result = await sql`SELECT 1 as test`;
      results.dbTest = { ok: true, result };
    } else {
      results.dbTest = { ok: false, error: "No DB URL" };
    }
  } catch (err: any) {
    results.neonImport = err?.message || String(err);
  }

  // Try importing routes
  try {
    const routes = await import("../server/routes");
    results.routesImport = "ok";
  } catch (err: any) {
    results.routesImport = err?.message || String(err);
  }

  res.json(results);
}
