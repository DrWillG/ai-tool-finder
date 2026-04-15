@AGENTS.md

# AI Tool Finder — Claude Instructions

## Project
- **Live site:** https://drwillg.github.io/ai-tool-finder/
- **Repo:** https://github.com/DrWillG/ai-tool-finder
- **Stack:** Next.js 16 (static export), TypeScript, Tailwind v4, GSAP, Framer Motion, Lenis
- **Hosting:** GitHub Pages — auto-deploys on every push to `main` and every Sunday at midnight UTC

## Key Files
- `app/data/tools.ts` — all 40 AI tools (schema: id, n, c, d, p, pt, i, tg, g, nd, sj, b, ec, eb, rv)
- `app/data/subjects.ts` — grade/subject/filter label maps
- `app/lib/scoring.ts` — 5-dimension scoring algorithm (grade, subject, ecosystem, need, budget)
- `app/components/Hero.tsx` — hero stats: toolCount and categoryCount are dynamic; date uses `new Date()`
- `app/page.tsx` — 5-step quiz flow → scoreTools() → Results
- `.github/workflows/deploy.yml` — build → deploy → smoke test pipeline

## Tool Schema (tools.ts)
```
id: string          — unique key
n:  string          — display name
c:  string          — category (used for grouping in Results)
d:  string          — short description (1-2 sentences)
p:  string          — pricing string
pt: "f"|"fm"|"p"   — free / freemium / paid
i:  string          — single icon character
tg: string[]        — tags (shown on cards)
g:  string[]        — grades: "k2","35","68","912","all"
nd: string[]        — needs: save_time, differentiate, engage, assess, detect, student_ai
sj: string[]        — subjects: ela, math, science, social_studies, arts, pe, foreign_lang, tech, general
b:  string[]        — budget: "free","low","district"
ec: string[]        — ecosystems: "google","microsoft","mixed"
eb: Record<string,number> — ecosystem boost scores
rv: {r,s,q}        — rating, source, quote
```
Also add a matching entry to `TOOL_COLORS` at the bottom of tools.ts when adding a new tool.

## Running Locally
```bash
# Load Node.js (installed via nvm)
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"

npm run dev          # dev server at localhost:3000
npm run build        # static export to ./out
```

## Browser Debugging on Mac
All three browsers are installed. Use DevTools for manual inspection:
- **Chrome:** Cmd+Option+I  →  best all-around DevTools
- **Safari:** Cmd+Option+I  →  enable first: Safari → Settings → Advanced → Show Web Inspector
- **Firefox:** Cmd+Option+I →  best CSS grid and accessibility inspector

## Playwright Testing (automated)
Playwright v1.59 installed with Chromium, WebKit (Safari engine), and Firefox.

```bash
# Load Node.js first
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"

npm test                  # all browsers
npm run test:chromium     # Chrome only
npm run test:safari       # Safari/WebKit engine
npm run test:firefox      # Firefox only
npm run test:ui           # visual Playwright UI (interactive)
```

Tests live in `tests/smoke.spec.ts` — check hero stats, date, new tools in bundle, and full quiz flow.

## Deployment
- Every push to `main` → instant redeploy via GitHub Actions
- Every Sunday midnight UTC → scheduled redeploy (keep repo active or GitHub disables cron after 60 days of no pushes)
- After deploy: Playwright smoke test runs automatically in CI against the live site
- Manual redeploy: GitHub Actions → Deploy to GitHub Pages → Run workflow

## Updating Tools
1. Edit `app/data/tools.ts` — add/update tool entries and TOOL_COLORS
2. The hero tool count, category count, and date all update automatically at build time
3. Push to main → GitHub Actions builds, deploys, and smoke-tests automatically
