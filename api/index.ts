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
  if (!initialized) {
    await registerRoutes(httpServer, app);
    initialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureInit();
  app(req as any, res as any);
}
