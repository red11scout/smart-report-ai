# SmartReportAI Vercel Compatibility Gaps

Every Replit-to-Vercel incompatibility encountered and how it was resolved.

---

## 1. SSE (Server-Sent Events) Incompatible with Serverless

**Problem**: The app used SSE to stream analysis progress from the server to the client. Vercel serverless functions have a 10-second timeout and cannot hold open long-lived HTTP connections.

**Resolution**: Replaced server-side SSE with client-side progress simulation. The client displays estimated progress stages while the API call runs, then jumps to 100% on completion.

**Trade-off**: Progress is cosmetic rather than real. Acceptable because the actual analysis is a single Claude API call — there are no meaningful intermediate steps to report.

---

## 2. Neon WebSocket Driver Incompatible with Serverless

**Problem**: The Neon database connection used the WebSocket transport (`@neondatabase/serverless` with `ws`). WebSocket connections cannot be established in Vercel's serverless runtime.

**Resolution**: Switched to Neon's HTTP transport, which uses standard fetch-based queries. No code changes needed beyond removing the `ws` import and updating the driver initialization.

---

## 3. Path Aliases Not Resolved in Serverless Bundle

**Problem**: TypeScript path aliases (`@shared/*`, `@db/*`) defined in `tsconfig.json` are not resolved by Vercel's build process. The server bundle failed with "module not found" errors.

**Resolution**: Replaced all path alias imports with relative imports (e.g., `../../shared/schema`). Removed alias definitions from `tsconfig.json`.

---

## 4. Cross-Directory Imports Not Bundled

**Problem**: The Express server imports from `shared/` (a sibling directory). Vercel's default build only processes files within the `api/` directory, so `shared/` modules were missing from the deployed bundle.

**Resolution**: Added a custom esbuild step (`script/build.ts`) that pre-bundles the server code with all its dependencies into a single file. The `api/index.ts` entry point imports this bundle.

---

## 5. Replit Vite Plugins Unavailable

**Problem**: Three Replit-specific Vite plugins were in the config:
- `@replit/vite-plugin-cartographer` (source mapping for Replit)
- `@replit/vite-plugin-runtime-error-modal` (error overlay)
- `@replit/vite-plugin-shadcn-theme-json` (theme sync)

These packages are not published to npm and only exist in Replit's environment.

**Resolution**: Removed all three plugins from `vite.config.ts`. No replacements needed — Vite's built-in error overlay and standard shadcn theming work fine.

---

## 6. Debug Endpoints Exposed Internals

**Problem**: Nine `/api/debug/*` endpoints existed for Replit development. These exposed environment variables, database state, Anthropic API status, route tables, and schema details.

**Resolution**: Removed all 9 endpoints. They served no purpose outside Replit and would be a security risk in production.

---

## Summary Table

| Gap | Replit Approach | Vercel Resolution |
|---|---|---|
| Progress streaming | Server-Sent Events | Client-side simulation |
| DB connection | WebSocket transport | HTTP transport |
| Path aliases | tsconfig `paths` | Relative imports |
| Cross-dir imports | Monorepo mode | esbuild pre-bundle |
| Replit plugins (3) | Installed in Replit env | Removed |
| Debug endpoints (9) | Used during dev | Removed |
