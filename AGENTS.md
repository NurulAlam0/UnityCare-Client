<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# UnityCare (client)

Next.js 16.4 App Router app (React 19, TypeScript strict, Tailwind v4, Turbopack). Early stage: one page (`src/app/page.tsx`), a better-auth setup, and a full generated shadcn component set under `src/components/ui/` (mostly unused). Single package — no monorepo.

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`); no args = whole repo. **Currently fails** with pre-existing issues in generated/scratch code (e.g. `react-hooks/set-state-in-effect` error in `src/components/ui/carousel.tsx`, unused `Image` import in `page.tsx`). Don't rewrite generated shadcn files just to make lint green unless asked.
- No typecheck or test scripts exist. Use `npx tsc --noEmit` for types. There is no test framework installed — don't invent one unless asked.

## Auth (better-auth + MongoDB)

- Server config: `src/lib/auth.ts` (`mongodbAdapter`, email+password enabled). Client: `src/lib/auth-client.ts` (baseURL hardcoded to `http://localhost:3000`). Route handler: `src/app/api/auth/[...all]/route.ts`.
- Env vars (`.env`, gitignored): `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`; optional Google sign-in uses `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- **Gotcha:** `src/lib/auth.ts` imports `mongodb`, but `mongodb` is NOT declared in `package.json` — TypeScript resolves it from a parent directory's `node_modules` (`../../node_modules/mongodb`), so it only works on this machine. `@better-auth/mongo-adapter` is likewise used but undeclared (present via the lockfile as an optional peer of `better-auth`). A fresh clone fails until these are properly installed; run `npm ls mongodb` if module resolution behaves strangely. Don't delete the parent `node_modules` or move the repo without fixing this.

## UI stack

- shadcn style is `base-nova` (`components.json`): components use **`@base-ui/react`, not Radix**. Don't copy Radix-based shadcn code from older tutorials.
- `cn` comes from the `cn` npm package, re-exported by `src/lib/utils.ts` — don't replace it with the usual clsx/tailwind-merge implementation.
- Tailwind v4 is CSS-first: config lives in `src/app/globals.css` (no `tailwind.config`), compiled via the `@tailwindcss/turbopack` loader rule in `next.config.ts`.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and the React Compiler (`babel-plugin-react-compiler`) — components are auto-memoized; don't add manual `memo`/`useMemo` noise.

## Conventions

- Path alias: `@/*` → `src/*`.
- Windows environment; paths here contain parentheses — quote them in shell commands.
- Unreleased repo: everything since the initial create-next-app commit is uncommitted on `master`; there is no CI.
