# SmartReportAI — Claude Code Configuration

## Project Overview
Strategic AI opportunity assessment platform. Generates 8-step company analyses with benefits quantification, token modeling, and priority scoring.

## Stack
- Frontend: React 19, Vite 7, Tailwind v4, shadcn/ui, Wouter, TanStack Query
- Backend: Express 4, Node.js (ESM)
- Database: PostgreSQL (Neon) via Drizzle ORM (neon-http driver)
- AI: Anthropic Claude SDK (claude-sonnet-4-5-20250929)
- Exports: jsPDF, XLSX, docx (all client-side)

## Key Patterns
- `apiRequest(method, url, data?)` — not used here; direct fetch calls
- Path aliases: `@/` → `client/src/`, `@shared/` → `shared/`, `@db` → `server/db.ts`
- DB driver: `drizzle-orm/neon-http` with `neon()` from `@neondatabase/serverless` (HTTP transport, serverless-compatible)
- No auth — all endpoints public
- No WebSockets, no SSE — progress simulation is client-side
- Report generation uses p-retry with exponential backoff (3 retries, 5s-120s)

## Environment Variables
- `NEON_DB_URL` — PostgreSQL connection (priority 1)
- `DATABASE_URL` — fallback PostgreSQL connection
- `ANTHROPIC_API_KEY` — Claude API key (also accepts `AI_INTEGRATIONS_ANTHROPIC_API_KEY`)
- `NODE_ENV` — development/production

## Architecture
- `server/app.ts` — Express app setup (shared between local dev and Vercel)
- `server/index.ts` — Local dev server entry (listens on PORT)
- `api/index.ts` — Vercel serverless function entry
- `server/routes.ts` — All API endpoints
- `server/ai-service.ts` — Claude API integration with retry logic
- `server/storage.ts` — Database access layer
- `shared/schema.ts` — Drizzle schema (4 tables, 273 default assumption fields)

## Deployment
- **Platform:** Vercel (Pro plan)
- **Build:** `vite build` (client only — Vercel handles the serverless function)
- **Local dev:** `npm run dev` → `tsx server/index.ts`
- **DB migrations:** `drizzle-kit push`

## Database Tables
- `reports` — Core report storage (analysis JSON)
- `assumptionSets` — Named assumption scenarios per report
- `assumptionFields` — Individual assumption values (273+ defaults)
- `formulaConfigs` — Custom formula definitions for calculations

## Conventions
- Brand: BlueAlly palette — Navy #001278, Blue #02a2fd, Green #36bf78
- Font: DM Sans
- All calculations deterministic (no AI in math)
- Conservative bias in all financial estimates (5% revenue haircut)
