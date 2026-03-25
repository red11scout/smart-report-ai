# SmartReportAI Go-Live Checklist

**Production URL**: https://smart-report-ai-weld.vercel.app
**Replit URL**: https://discover.movefasterwithai.com (still running)

---

## Infrastructure

- [x] Vercel project created and linked to GitHub
- [x] Environment variables set (NEON_DB_URL, ANTHROPIC_API_KEY)
- [x] Neon database connected
- [x] Database schema pushed via Drizzle
- [x] TypeScript compiles clean
- [x] Vite builds clean
- [x] Deployment succeeds without errors

## Smoke Tests (Verified)

- [x] Homepage loads (200 OK)
- [x] API health endpoint responds (`GET /api/health`)
- [x] API version endpoint responds (`GET /api/version`)
- [x] Database connected and schema pushed
- [x] Reports endpoint returns (`GET /api/reports` — empty array on fresh DB)

## Functional Tests (Manual)

- [ ] Full analysis flow: enter a company name, generate a complete report
- [ ] What-If analysis: modify assumptions and recalculate
- [ ] Assumption panel: edit and save assumptions
- [ ] PDF export
- [ ] Excel export
- [ ] Word export
- [ ] Report sharing / link generation

## UI / UX

- [ ] Mobile layout renders correctly
- [ ] All navigation links work
- [ ] Error states display properly (invalid company, API failure)
- [ ] Loading states / progress simulation looks natural

## DNS / Domain

- [ ] Custom domain configured on Vercel (if desired)
- [ ] SSL certificate provisioned
- [ ] Old Replit URL redirects or deprecation notice posted

## Post-Launch

- [ ] Monitor Vercel function logs for first 48 hours
- [ ] Check Neon dashboard for connection patterns
- [ ] Verify Anthropic API usage is within expected range
- [ ] Retire Replit deployment when confident
