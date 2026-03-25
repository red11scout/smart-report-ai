import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;

async function ensureInit() {
  if (initialized) return;
  await registerRoutes(httpServer, app);
  initialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureInit();
  } catch (err: any) {
    console.error("Init error:", err);
    return res.status(500).json({
      error: "Function initialization failed",
      message: err?.message || String(err),
    });
  }
  app(req as any, res as any);
}
