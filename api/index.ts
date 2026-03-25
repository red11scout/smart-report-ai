import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;
let initError: string | null = null;

async function ensureInit() {
  if (initialized) return;
  try {
    const { registerRoutes } = await import("../server/routes");
    await registerRoutes(httpServer, app);
    initialized = true;
  } catch (err: any) {
    initError = err?.message || String(err);
    console.error("Init error:", err);
    throw err;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureInit();
  } catch (err: any) {
    return res.status(500).json({
      error: "Function initialization failed",
      message: initError || err?.message,
    });
  }
  app(req as any, res as any);
}
