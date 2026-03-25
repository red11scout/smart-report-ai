# SmartReportAI Migration Audit

**Migration**: Replit to Vercel
**Status**: COMPLETE
**Date**: March 2026
**Production URL**: https://smart-report-ai-weld.vercel.app
**Previous URL**: https://discover.movefasterwithai.com (Replit)

---

## Application Profile

| Property | Value |
|---|---|
| Type | Full-stack Express + Vite SPA |
| Frontend | React 19, Vite 7, Tailwind, shadcn/ui |
| Backend | Express 4, serverless via Vercel |
| Database | Neon PostgreSQL (Drizzle ORM) |
| AI | Anthropic Claude SDK |
| Build | esbuild (server) + Vite (client) |

---

## Issues Found & Resolved

### Missing Files (22 total)

**4 critical server/build files** (created from scratch):

| File | Purpose |
|---|---|
| `server/static.ts` | Static file serving for Express |
| `server/formula-service.ts` | Financial formula calculation service |
| `script/build.ts` | Custom esbuild bundler for Vercel serverless |
| `vite-plugin-meta-images.ts` | Image metadata plugin (stub) |

**19 shadcn/ui components** (generated via CLI or created as stubs):
- Accordion, Alert, AlertDialog, Avatar, Badge, Card, Checkbox
- Dialog, DropdownMenu, Form, Input, Label, Progress, ScrollArea
- Select, Separator, Sheet, Tabs, Tooltip

**Other missing modules**:
- `client/src/pages/not-found.tsx` — 404 page
- `client/src/components/FormulaExplorer.tsx` — Formula visualization component
- `client/src/lib/ai-metrics-data.ts` — AI metrics constants

### 3 Placeholder Images

Created in `attached_assets/` to satisfy import references:
- `company-analysis.png`
- `financial-dashboard.png`
- `report-preview.png`

---

## Replit-Specific Code Removed

### 9 Debug Endpoints Removed

All were Replit-only diagnostic routes:
- `GET /api/debug/env`
- `GET /api/debug/db`
- `GET /api/debug/anthropic`
- `GET /api/debug/routes`
- `GET /api/debug/test-report`
- `GET /api/debug/schema`
- `GET /api/debug/migrations`
- `GET /api/debug/connection`
- `GET /api/debug/full`

### 3 Replit Vite Plugins Removed

- `@replit/vite-plugin-cartographer`
- `@replit/vite-plugin-runtime-error-modal`
- `@replit/vite-plugin-shadcn-theme-json`

### Proxy Bypass Logic

Removed Replit-specific proxy detection from `ai-service.ts` that was bypassing standard HTTP for Anthropic API calls.

---

## Architecture Changes

| Area | Replit | Vercel |
|---|---|---|
| SSE progress | Server-sent events during analysis | Client-side progress simulation |
| Neon driver | WebSocket (`@neondatabase/serverless` ws) | HTTP transport (serverless-compatible) |
| Path aliases | `@shared`, `@db` via tsconfig | Relative imports (`../../shared/`) |
| Cross-dir imports | Worked in monorepo mode | esbuild pre-bundles server + shared |
| Server runtime | Long-running Express process | Serverless functions (10s timeout) |

---

## Dependency Cleanup

**10+ unused dependencies removed**:
- `passport`, `passport-local` (no auth system)
- `memorystore`, `express-session` (no sessions)
- `connect-pg-simple` (no session store)
- `ws` (WebSocket — switched to HTTP)
- Replit-specific packages (3 Vite plugins)
- Various unused type packages
