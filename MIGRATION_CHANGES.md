# SmartReportAI Migration Changes

Complete list of every change made during the Replit-to-Vercel migration.

---

## Files Created

### Server & Build

| File | Purpose |
|---|---|
| `api/index.ts` | Vercel serverless entry point wrapping Express app |
| `server/static.ts` | Static file serving middleware for Express |
| `server/formula-service.ts` | Financial formula calculation service |
| `script/build.ts` | esbuild bundler for Vercel serverless deployment |
| `vite-plugin-meta-images.ts` | Image metadata Vite plugin (stub replacement) |
| `vercel.json` | Vercel routing config (SPA fallback + API proxy) |

### UI Components (shadcn/ui)

| File | Source |
|---|---|
| `client/src/components/ui/accordion.tsx` | shadcn CLI |
| `client/src/components/ui/alert.tsx` | shadcn CLI |
| `client/src/components/ui/alert-dialog.tsx` | shadcn CLI |
| `client/src/components/ui/avatar.tsx` | shadcn CLI |
| `client/src/components/ui/badge.tsx` | shadcn CLI |
| `client/src/components/ui/card.tsx` | shadcn CLI |
| `client/src/components/ui/checkbox.tsx` | shadcn CLI |
| `client/src/components/ui/dialog.tsx` | shadcn CLI |
| `client/src/components/ui/dropdown-menu.tsx` | shadcn CLI |
| `client/src/components/ui/form.tsx` | shadcn CLI |
| `client/src/components/ui/input.tsx` | shadcn CLI |
| `client/src/components/ui/label.tsx` | shadcn CLI |
| `client/src/components/ui/progress.tsx` | shadcn CLI |
| `client/src/components/ui/scroll-area.tsx` | shadcn CLI |
| `client/src/components/ui/select.tsx` | shadcn CLI |
| `client/src/components/ui/separator.tsx` | shadcn CLI |
| `client/src/components/ui/sheet.tsx` | shadcn CLI |
| `client/src/components/ui/tabs.tsx` | shadcn CLI |
| `client/src/components/ui/tooltip.tsx` | shadcn CLI |

### Pages & Components

| File | Purpose |
|---|---|
| `client/src/pages/not-found.tsx` | 404 page |
| `client/src/components/FormulaExplorer.tsx` | Formula visualization component |
| `client/src/lib/ai-metrics-data.ts` | AI metrics constants/data |

### Assets

| File | Purpose |
|---|---|
| `attached_assets/company-analysis.png` | Placeholder image |
| `attached_assets/financial-dashboard.png` | Placeholder image |
| `attached_assets/report-preview.png` | Placeholder image |

---

## Files Modified

### Server

| File | Changes |
|---|---|
| `server/index.ts` | Removed 9 debug endpoints; added Vercel-compatible export |
| `server/routes.ts` | Removed SSE progress streaming; cleaned Replit references |
| `server/ai-service.ts` | Removed Replit proxy bypass logic |
| `server/db.ts` | Switched Neon from WebSocket to HTTP transport |
| `server/storage.ts` | Updated imports to relative paths |

### Client

| File | Changes |
|---|---|
| `client/src/lib/queryClient.ts` | Removed SSE progress listener; added client-side simulation |
| `client/src/App.tsx` | Minor import path fixes |

### Config

| File | Changes |
|---|---|
| `vite.config.ts` | Removed 3 Replit plugins; cleaned plugin array |
| `tsconfig.json` | Removed `@shared` and `@db` path aliases |
| `package.json` | Updated scripts; removed unused deps; added build deps |
| `drizzle.config.ts` | Verified Neon connection string usage |

---

## Dependencies Added

| Package | Purpose |
|---|---|
| `esbuild` | Server bundling for Vercel |

## Dependencies Removed

| Package | Reason |
|---|---|
| `passport` | No auth system |
| `passport-local` | No auth system |
| `memorystore` | No server sessions |
| `express-session` | No server sessions |
| `connect-pg-simple` | No session store |
| `ws` | Replaced with HTTP transport |
| `@replit/vite-plugin-cartographer` | Replit-only |
| `@replit/vite-plugin-runtime-error-modal` | Replit-only |
| `@replit/vite-plugin-shadcn-theme-json` | Replit-only |

---

## Config Changes

### vercel.json (new)

- Routes all `/api/*` requests to the serverless function at `api/index.ts`
- Routes all other requests to the Vite-built SPA (`dist/public/index.html`)
- Build command: `npm run build`
- Output directory: `dist`

### package.json scripts

| Script | Before (Replit) | After (Vercel) |
|---|---|---|
| `build` | `vite build` | `vite build && tsx script/build.ts` |
| `start` | `node server/index.ts` | Not used (serverless) |
| `dev` | Replit workflow | `vite dev` + `tsx server/index.ts` |
