# SmartReportAI Environment Variables

## Required Variables

| Variable | Environments | Description |
|---|---|---|
| `NEON_DB_URL` | Production, Preview | PostgreSQL connection string from Neon. Format: `postgresql://user:pass@host/dbname?sslmode=require` |
| `ANTHROPIC_API_KEY` | Production | Anthropic Claude API key for report generation. Starts with `sk-ant-` |
| `NODE_ENV` | All | Auto-set by Vercel (`production` or `development`). Do not set manually. |

## Vercel Dashboard Configuration

1. Go to **Project Settings > Environment Variables**
2. Add `NEON_DB_URL` for **Production** and **Preview** environments
3. Add `ANTHROPIC_API_KEY` for **Production** only (keep out of Preview to avoid accidental API spend)

## Neon Database

- The connection string uses **HTTP transport** (not WebSocket)
- Neon's serverless driver auto-detects the transport from the connection string
- No special pooler configuration needed

## Local Development

Create a `.env` file in the project root (already in `.gitignore`):

```
NEON_DB_URL=postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/dbname?sslmode=require
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

## Notes

- No auth tokens or session secrets are needed (app has no authentication)
- No Redis or cache configuration required
- No storage bucket keys needed (no file uploads)
