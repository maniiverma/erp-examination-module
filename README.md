# Ethical Hacking Project

A Next.js project for the Ethical Hacking course — each team builds their module as an isolated route + library code on top of a shared stack.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16 (App Router)** | React framework |
| **TypeScript** | Language — all code must be typed |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui** | UI component library (`@/components/ui`) |
| **Hono** | API framework — all `/api/*` routes via `app/api/[[...route]]/route.ts` |
| **Turso (SQLite)** | Database — SQLite at the edge |
| **Drizzle ORM + Drizzle Kit** | Type-safe ORM & migrations |

> Do not introduce any other styling / UI / database libraries without prior approval.

> 🔒 **Security — MANDATORY:** Read [`SECURITY.md`](./SECURITY.md) before writing any `lib/<module>/**` or `app/<route>/**` code. No global Turso functions — every DB function must do `requireAuth() → requireRole() → validate → query` (**placeholders owned by `team/auth` via `lib/auth/*` — other teams just `import { requireRole } from "@/lib/auth/guard"`**). JWT via httpOnly cookies (no OAuth needed), passwords with `bcrypt` + salt. Main site stays secure — insecure demo (`app/demo/insecure-auth`) comes later, isolated. PRs with unauthenticated functions or plaintext passwords will be rejected.

## Prerequisites

- `bun` v1.3+ (project uses `bun.lock` — use `bun install`)
- Turso account + CLI (for DB url/token if you need to create your own DB)

## Getting Started

```bash
# 1. Clone & install
git clone <repo-url>
cd ethical-hacking-project
bun install

# 2. Configure env (ask lead for values or create your own Turso DB)
cp .env.example .env.local
# .env.local must contain:
# TURSO_DATABASE_URL=libsql://...
# TURSO_AUTH_TOKEN=eyJ...

# 3. Sync database
bun run db:sync        # generate + migrate + push (one command)
# or individually:
# bun run db:generate  # generate SQL from lib/schema.ts
# bun run db:migrate   # apply migrations to Turso
# bun run db:push      # push schema directly (dev alternative)

# 4. Run dev server
bun dev
# open http://localhost:3000
```

## Project Structure

```
app/
  api/[[...route]]/route.ts  # ★ Hono — single API entry (see Auth-Api). DO NOT create Next Route Handlers
  layout.tsx          # root layout — DO NOT EDIT
  page.tsx            # landing page — DO NOT EDIT
  globals.css         # global Tailwind styles — DO NOT EDIT
  <your-route>/       # <-- CREATE YOUR ROUTE HERE e.g. app/team-xyz/page.tsx
lib/
  schema.ts           # ★ ONLY shared file you may edit (Drizzle tables)
  turso.ts            # Turso client — DO NOT EDIT
  utils.ts            # shadcn helper — DO NOT EDIT
  <your-module>/      # <-- helper functions for your module go here
                      # e.g. lib/team-xyz/helpers.ts, lib/team-xyz/queries.ts
components/
  ui/                 # shadcn components — DO NOT EDIT, just import
drizzle/              # generated migrations — DO NOT EDIT MANUALLY
drizzle.config.ts     # drizzle config — DO NOT EDIT
```

## Workflow — Branch per Team

**Every team MUST work on its own branch.**

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create your team branch
git checkout -b team/<team-name>
# examples: team/sql-injection , team/xss-demo , team/phishing-awareness

# 3. Work & commit
git add app/<your-route> lib/<your-module> lib/schema.ts
git commit -m "feat(team-xyz): add <feature>"

# 4. Push & open PR to main
git push -u origin team/<team-name>
```

> Keep your branch rebased on `main` if `lib/schema.ts` changes upstream.

## Contribution Rules — READ CAREFULLY

> **Violations will cause the PR/branch to be rejected instantly.**

### 1. What you MAY edit

| Allowed | Details |
|---------|---------|
| `lib/schema.ts` | **The ONLY root shared file you may touch.** Add your tables there. Coordinate with other teams to avoid table name collisions. |
| `app/<your-route>/**` | Create **new routes** for your feature. Do not modify existing routes belonging to other teams. |
| `lib/<your-module>/**` | Create a folder named after your module/team for all helper functions, queries, utils, types, etc. E.g. `lib/phishing/utils.ts` |

### 2. What you MUST NOT edit

- **NEVER touch `package.json`** — adding/removing dependencies via branches is forbidden. Need a package? Request it from the lead. Branches that modify `package.json` will be **rejected instantly**.
- **NEVER edit files you are not assigned to.** Don't touch `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `lib/turso.ts`, `lib/utils.ts`, `drizzle.config.ts`, `components/ui/*`, or another team's `app/*` / `lib/*` folder.
- **NEVER ship unauthenticated Turso functions** — see [`SECURITY.md`](./SECURITY.md): wrap every sensitive function with `requireAuth()`/`requireRole()` (**placeholders — owned by `team/auth` at `lib/auth/*`**, just import once landed), use `bcrypt` (12 rounds) for passwords, JWT in `httpOnly` cookies. Global callable `db.*` exports will be rejected. Do not create `lib/auth/*` if you are not `team/auth`.
- **NEVER edit `drizzle/` manually** — it is generated by `drizzle-kit`.
- **NEVER commit `.env.local`** — it is gitignored and contains secrets.

### 3. Unified / Shared Code

If you need shared types, constants, or helpers that multiple teams will use:

- Create them under `lib/` as a new file/folder — e.g. `lib/shared/constants.ts`, `lib/validators.ts`
- Discuss with the lead first so naming doesn't clash.
- Do **not** modify existing shared files to add your code — create new ones.

### 4. Correct Example

```bash
# ✅ CORRECT — team "xss"
app/xss/page.tsx
app/xss/components/XssDemo.tsx
lib/xss/queries.ts
lib/xss/validator.ts
lib/schema.ts          # added xssAttempts table

# ❌ WRONG
package.json           # NEVER
app/page.tsx           # belongs to root, don't edit
lib/turso.ts           # don't edit
lib/other-team/helper.ts # don't touch other team's code
```

## Database

- Schema is defined in `lib/schema.ts` using Drizzle (`sqliteTable`).
- Turso client is at `lib/turso.ts` / `lib/db.ts` — just import `db` :

```ts
// Hono handler (use this — not Next Route Handlers):
import { Hono } from "hono";
import { db } from "@/lib/turso";
import { users } from "@/lib/schema";

const app = new Hono().basePath("/api");
app.get("/users", async (c) => {
  const rows = await db.select().from(users);
  return c.json(rows);
});
// see app/api/[[...route]]/route.ts + https://github.com/real-zephex/Auth-Api
```

- After editing `lib/schema.ts`, run:

```bash
bun run db:sync
```

This generates the migration, applies it, and pushes to Turso in one go.

- Drizzle Studio (optional):

```bash
bunx drizzle-kit studio
```

## API — Hono (Not Next.js Route Handlers)

> **All API routes are Hono.** Do not create `app/api/<x>/route.ts` Next.js handlers. Define routes in `app/api/[[...route]]/route.ts` via `new Hono().basePath("/api")` + `handle(app)`.

Central file is already configured (`hono`, `hono/vercel`, `hono/cors`, `hono/logger`, `hono/cookie`) — see `app/api/[[...route]]/route.ts`:

```ts
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api");
app.use(logger());
app.use("/*", cors({ origin: "*", credentials: true }));
app.get("/hello", (c) => c.json({ message: "hello world" }));
export const GET = handle(app);
export const POST = handle(app);
```

**Add your team routes there (coordinate with `team/auth`):**

```ts
// inside app/api/[[...route]]/route.ts — after base setup
import { zValidator } from "@hono/zod-validator"; // or manual safeParse
import { createPostSchema } from "@/lib/<your-module>/schema";

app.post("/<your-module>/create", async (c) => {
  // Auth is placeholder — provided by team/auth, see SECURITY.md
  const user = await requireRole(c, ["editor"]); // <- from lib/auth/guard (team/auth)
  const raw = await c.req.json();
  const parsed = createPostSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  await db.insert(posts).values({ ...parsed.data, ownerId: user.userId });
  return c.json({ ok: true }, 201);
});
```

> For auth (`/register`, `/login`, JWT, cookies, hashing), **take inspiration from [`real-zephex/Auth-Api`](https://github.com/real-zephex/Auth-Api)** — see `Auth-Api/src/index.ts` (Hono + `bcryptjs` + `jose` + `hono/cookie`) and `Auth-Api/lib/auth/jwt.ts`. Auth-Api uses `hash(password, 10)` + `SignJWT({email}).setExpirationTime("7d")` + `setCookie(c, "auth_token", token, { httpOnly:true, secure:true, sameSite:"Lax" })` — copy that shape.

## Styling & UI

- Use **Tailwind CSS** utility classes for all styling.
- Use **shadcn/ui** components from `@/components/ui` — add new ones locally only if needed (ask lead first, since it modifies `components.json`):

```bash
npx shadcn@latest add button --yes
```

- Keep TypeScript strict — no `any` without justification.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run db:generate` | Generate SQL from `lib/schema.ts` |
| `bun run db:migrate` | Apply migrations to Turso |
| `bun run db:push` | Push schema directly (dev) |
| `bun run db:sync` | **Generate + Migrate + Push in one command** |

## Security

Read [`SECURITY.md`](./SECURITY.md) for the full guide: never expose global `db` functions, always `requireAuth()` → `requireRole(["admin"])` before `edit/delete` (**placeholders — `lib/auth/guard.ts`, `lib/auth/jwt.ts`, `lib/auth/password.ts` owned by `team/auth` — other teams just `import`**), JWT via `httpOnly` cookies (`jose`) — no Google/GitHub OAuth, passwords via `bcrypt` (salt automatic, 12 rounds) or `argon2id`, Zod validation on every input, demo insecure auth later under `app/demo/insecure-auth` (only place plaintext/unsalted SHA256 is allowed, with ⚠️ banner). Not on `team/auth`? Do not create `lib/auth/*` — ask the lead. Want to test broken auth? Only under `app/demo/insecure-auth/`.

---
## Forms — `zod` + `react-hook-form` (AuraEdge Pattern)

> Reference: [`auraedge-website/app/register/page.tsx`](https://raw.githubusercontent.com/real-zephex/auraedge-website/refs/heads/main/app/register/page.tsx) — every team must copy this exact flow.

1. **Define one `zod` schema** (`lib/<module>/schema.ts`) and `type Input = z.infer<typeof schema>` — never hand-type the form type. AuraEdge: `registerSchema` + `z.infer`.
2. **`useForm<Input>({ resolver: zodResolver(schema), defaultValues: {...} })`** — always set defaults (enums/booleans). Destructure `register, handleSubmit, setValue, watch, formState:{errors,isSubmitting}`.
3. **Every field:** `<Input {...register("field")} />` + `{errors.field && <p>{errors.field.message}</p>}` — exactly like AuraEdge does for every `first_name`, `email`, `membership_fee_agreement`.
4. **`setValue`/`watch`** when auto-populating (AuraEdge: `setValue("email", user.email)` via `useEffect`).
5. **Re-validate on server:** `requireRole()` (**placeholder from `team/auth`**) → `schema.safeParse(raw)` → `db.*`. Client resolver is UX, server parse is security. Full example in [`SECURITY.md`](./SECURITY.md#5-form-validation--zod--react-hook-form-follow-auraedge-pattern).

See `SECURITY.md` §5 for full client + server code snippets.

---

## Need Help?

- Check `AGENTS.md` for agent-specific instructions.
- For doubts about `lib/schema.ts` conflicts or shared `lib/` files, ping the lead before pushing.
- Never force-push to `main`.

---
Built with Next.js • Tailwind CSS • shadcn/ui • TypeScript • Turso
