"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DemoForm } from "@/components/demo-form";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  GitBranch,
  Database,
  Palette,
  Code2,
  TriangleAlert,
  Check,
  X,
  FolderTree,
  Terminal,
  Copy,
  CheckCheck,
  Layers,
  FileCode2,
  Zap,
  Lock,
  Users,
  ArrowRight,
  ExternalLink,
  Boxes,
  FilePlus2,
  Ban,
  Sparkles,
} from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center justify-center rounded-md border bg-background p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      aria-label="Copy"
    >
      {copied ? (
        <CheckCheck className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900 dark:bg-zinc-900 rounded-t-lg border border-zinc-800">
        <span className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </span>
          <span className="ml-2 hidden sm:inline">{lang}</span>
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto bg-zinc-950 text-zinc-100 p-4 rounded-b-lg text-[13px] leading-relaxed font-mono border-x border-b border-zinc-800">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Grid background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/20" />

      {/* NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b">
        <div className="mx-auto max-w-6xl px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <span className="font-semibold tracking-tight text-[15px]">
              ethical-hacking-project
            </span>
            <Badge
              variant="secondary"
              className="ml-1 hidden sm:inline-flex text-[11px] font-mono"
            >
              Next.js 16
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="hidden md:inline-flex font-mono text-xs"
            >
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />{" "}
              Turso ready
            </Badge>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden sm:inline-flex",
                redirect("/examination")
              )}
            >
              GitHub <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10 md:pt-20 md:pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Semester Project • Each team works in isolation
            <span className="hidden sm:inline-flex items-center gap-1 ml-1">
              <Separator orientation="vertical" className="h-3" />
              <span className="font-mono">bun v1.3.14</span>
            </span>
          </div>

          <h1 className="mt-6 text-[34px] md:text-[48px] font-bold tracking-tighter leading-[0.95] text-foreground">
            Ethical Hacking
            <span className="block font-light tracking-tight text-muted-foreground">
              Project Workspace
            </span>
          </h1>

          <p className="mt-4 text-[15px] md:text-base leading-7 text-muted-foreground max-w-2xl mx-auto">
            A shared Next.js workspace where every team ships its module as an
            isolated route + library code on top of a unified stack. Follow the
            rules, stay on your branch, and build.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#getting-started"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-6 h-10",
              )}
            >
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </a>
            <a
              href="#rules"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-6 h-10 font-mono text-xs",
              )}
            >
              <TriangleAlert className="mr-1.5 h-3.5 w-3.5" /> Read Rules
            </a>
          </div>

          {/* Quick clone */}
          <div className="mt-8 mx-auto max-w-xl">
            <div className="flex items-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pl-2">
                <Terminal className="h-3.5 w-3.5" /> clone
              </div>
              <code className="flex-1 text-left text-xs md:text-sm font-mono truncate px-2">
                git clone &lt;repo-url&gt; && bun install && bun run db:sync
              </code>
              <CopyButton text="git clone <repo-url> && bun install && bun run db:sync" />
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {[
            {
              icon: Palette,
              label: "Tailwind CSS",
              sub: "v4 • styling",
              accent: "from-sky-500/10 to-cyan-500/10",
            },
            {
              icon: Boxes,
              label: "shadcn/ui",
              sub: "component library",
              accent: "from-zinc-500/10 to-zinc-500/5",
            },
            {
              icon: FileCode2,
              label: "TypeScript",
              sub: "strict • typed",
              accent: "from-blue-600/10 to-indigo-600/10",
            },
            {
              icon: Zap,
              label: "Hono",
              sub: "API • [[...route]]",
              accent: "from-orange-500/10 to-amber-500/10",
            },
            {
              icon: Database,
              label: "Turso (SQLite)",
              sub: "edge database",
              accent: "from-emerald-500/10 to-teal-500/10",
            },
          ].map((s) => (
            <Card
              key={s.label}
              className="relative overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.accent} pointer-events-none`}
              />
              <CardHeader className="relative pb-2">
                <div className="h-9 w-9 rounded-xl border bg-background flex items-center justify-center shadow-sm">
                  <s.icon className="h-4.5 w-4.5" />
                </div>
                <CardTitle className="text-[14px] mt-3 tracking-tight">
                  {s.label}
                </CardTitle>
                <CardDescription className="text-xs font-mono">
                  {s.sub}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
          <div className="col-span-2 md:col-span-5">
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-100">
              <TriangleAlert className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-xs font-semibold tracking-wide uppercase">
                Stack lock
              </AlertTitle>
              <AlertDescription className="text-xs md:text-sm leading-6">
                Do not introduce other styling / UI / database libraries. All <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">/api/*</code> via Hono in <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">app/api/[[...route]]/route.ts</code> — don&apos;t create Next Route Handlers.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator />
      </div>

      {/* GETTING STARTED + STRUCTURE */}
      <section
        id="getting-started"
        className="mx-auto max-w-6xl px-6 py-10 md:py-14"
      >
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              <Zap className="h-3.5 w-3.5" /> Getting Started
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              From clone to running in 4 steps
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Every team uses the same env and DB sync flow. Ask the lead for
              Turso credentials or create your own DB at turso.tech.
            </p>

            <Tabs defaultValue="bun" className="mt-6">
              <TabsList className="rounded-full h-8 p-1">
                <TabsTrigger value="bun" className="rounded-full text-xs px-3">
                  bun
                </TabsTrigger>
                <TabsTrigger value="npm" className="rounded-full text-xs px-3">
                  npm
                </TabsTrigger>
              </TabsList>
              <TabsContent value="bun" className="mt-4 space-y-4">
                <CodeBlock
                  code={`# 1. Clone & install
git clone <repo-url>
cd ethical-hacking-project
bun install

# 2. Configure env (ask lead or create your own Turso DB)
cp .env.example .env.local
# .env.local must contain:
# TURSO_DATABASE_URL=libsql://...
# TURSO_AUTH_TOKEN=eyJ...

# 3. Sync database (one command)
bun run db:sync

# 4. Run dev server
bun dev
# → http://localhost:3000`}
                />
              </TabsContent>
              <TabsContent value="npm" className="mt-4">
                <CodeBlock
                  code={`npm install
cp .env.example .env.local
npm run db:sync
npm run dev`}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { k: "db:generate", v: "Generate SQL" },
                { k: "db:migrate", v: "Apply migrations" },
                { k: "db:sync", v: "Generate + migrate + push" },
              ].map((i) => (
                <div key={i.k} className="rounded-lg border bg-card p-3">
                  <div className="text-[11px] font-mono font-semibold">
                    {i.k}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {i.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="overflow-hidden border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm tracking-tight">
                    Project Structure
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Only touch what&apos;s yours. Everything else is locked.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border bg-muted/30 p-4 font-mono text-[12.5px] leading-6 overflow-x-auto">
                  <div>
                    <span className="text-muted-foreground">app/</span>
                  </div>
                  <div className="pl-3 border-l ml-1 space-y-0.5">
                    <div>
                      layout.tsx{" "}
                      <span className="text-muted-foreground">
                        — DO NOT EDIT
                      </span>
                    </div>
                    <div>
                      page.tsx{" "}
                      <span className="text-muted-foreground">
                        — DO NOT EDIT
                      </span>
                    </div>
                    <div>
                      globals.css{" "}
                      <span className="text-muted-foreground">
                        — DO NOT EDIT
                      </span>
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <FilePlus2 className="h-3 w-3" /> &lt;your-route&gt;/{" "}
                      <span className="font-normal">← CREATE HERE</span>
                    </div>
                    <div className="text-muted-foreground tracking-tight">
                      e.g. app/xss/page.tsx
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-muted-foreground">lib/</span>
                  </div>
                  <div className="pl-3 border-l ml-1 space-y-0.5">
                    <div>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        schema.ts ★
                      </span>{" "}
                      <span className="text-muted-foreground">
                        — ONLY shared file you may edit
                      </span>
                    </div>
                    <div>
                      turso.ts{" "}
                      <span className="text-muted-foreground">
                        — DO NOT EDIT
                      </span>
                    </div>
                    <div>
                      utils.ts{" "}
                      <span className="text-muted-foreground">
                        — DO NOT EDIT
                      </span>
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <FilePlus2 className="h-3 w-3" /> &lt;your-module&gt;/{" "}
                      <span className="font-normal">← helpers here</span>
                    </div>
                    <div className="text-muted-foreground">
                      e.g. lib/xss/queries.ts
                    </div>
                  </div>
                  <div className="mt-3 space-y-0.5">
                    <div>
                      components/ui/{" "}
                      <span className="text-muted-foreground">
                        — DO NOT EDIT, just import
                      </span>
                    </div>
                    <div>
                      drizzle/{" "}
                      <span className="text-muted-foreground">
                        — generated, don&apos;t touch
                      </span>
                    </div>
                    <div>
                      drizzle.config.ts{" "}
                      <span className="text-muted-foreground">
                        — DO NOT EDIT
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" /> Keep imports via{" "}
                  <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-xs">
                    @/components/ui
                  </code>{" "}
                  &{" "}
                  <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-xs">
                    @/lib/*
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" /> Database
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs leading-6 text-muted-foreground">
                  Schema lives in{" "}
                  <code className="font-mono bg-muted px-1 py-0.5 rounded">
                    lib/schema.ts
                  </code>{" "}
                  (Drizzle{" "}
                  <code className="font-mono bg-muted px-1 py-0.5 rounded">
                    sqliteTable
                  </code>
                  ). Import the client from{" "}
                  <code className="font-mono bg-muted px-1 py-0.5 rounded">
                    lib/turso.ts
                  </code>
                  .
                </p>
                <CodeBlock
                  lang="ts"
                  code={`// Hono handler (not Next Route Handler)
import { Hono } from "hono";
import { db } from "@/lib/turso";
import { users } from "@/lib/schema";
const app = new Hono().basePath("/api");
app.get("/users", async (c) => {
  const rows = await db.select().from(users);
  return c.json(rows);
});
// see app/api/[[...route]]/route.ts + Auth-Api/src/index.ts`}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator />
      </div>

      {/* WORKFLOW */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5" /> Workflow
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Branch per team — no exceptions
          </h2>
          <Badge variant="secondary" className="font-mono text-xs">
            team/&lt;team-name&gt;
          </Badge>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Start from main",
              code: "git checkout main\ngit pull origin main",
              icon: Users,
            },
            {
              step: "02",
              title: "Create team branch",
              code: "git checkout -b team/<name>\n# e.g. team/xss-demo",
              icon: GitBranch,
            },
            {
              step: "03",
              title: "Work & commit",
              code: 'git add app/<route> lib/<module>\ngit commit -m "feat: ..."',
              icon: Code2,
            },
            {
              step: "04",
              title: "Push & open PR",
              code: "git push -u origin team/<name>\n→ PR to main",
              icon: ExternalLink,
            },
          ].map((s) => (
            <Card
              key={s.step}
              className="relative overflow-hidden border shadow-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-widest text-muted-foreground">
                    {s.step}
                  </span>
                </div>
                <CardTitle className="text-sm mt-3">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-3 text-xs font-mono leading-5 border border-zinc-800 overflow-x-auto">
                  {s.code}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert className="mt-4">
          <Users className="h-4 w-4" />
          <AlertTitle className="text-xs font-semibold">
            Rebase often
          </AlertTitle>
          <AlertDescription className="text-xs leading-6">
            Keep your branch rebased on{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded">main</code>{" "}
            when{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded">
              lib/schema.ts
            </code>{" "}
            changes upstream to avoid table name collisions.
          </AlertDescription>
        </Alert>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator />
      </div>

      {/* RULES */}

      {/* SECURITY — MANDATORY */}
      <section id="security" className="mx-auto max-w-6xl px-6 py-10 md:py-14 scroll-mt-16">
        <div className="rounded-2xl border-2 border-red-200 dark:border-red-900 bg-red-50/60 dark:bg-red-950/20 overflow-hidden shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Security — Mandatory</h2>
                    <Badge className="bg-red-600 hover:bg-red-600 text-white border-0 text-[11px]">READ BEFORE CODING</Badge>
                  </div>
                  <p className="text-xs font-mono text-red-700 dark:text-red-300 mt-1">SECURITY.md • No global Turso functions • PRs without auth will be rejected</p>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">⚠️ requireAuth()/requireRole() snippets are placeholders — owned by <code className="bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">team/auth</code> (<code className="bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">lib/auth/*</code>). Other teams just import.</p>
                </div>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full bg-white dark:bg-zinc-900")}
              >
                Open SECURITY.md <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-3">
              <Card className="border-red-200 dark:border-red-900 bg-white dark:bg-zinc-900 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-red-600" /> 1. No Global Functions</CardTitle>
                </CardHeader>
                <CardContent className="text-xs leading-6 text-muted-foreground">
                  Never export a raw <code className="font-mono bg-muted px-1 py-0.5 rounded">db.*</code> call callable from the client. Every sensitive function must start with <code className="font-mono bg-muted px-1 py-0.5 rounded">requireAuth() → requireRole([...])</code> → validate → query — <span className="font-semibold text-foreground">placeholder, provided by <code className="font-mono bg-muted px-1 py-0.5 rounded">team/auth</code> via <code className="font-mono bg-muted px-1 py-0.5 rounded">lib/auth/guard</code></span>. <code className="font-mono bg-muted px-1 py-0.5 rounded">lib/turso.ts</code> only inside <code className="font-mono bg-muted px-1 py-0.5 rounded">app/api/[[...route]]/route.ts</code> Hono handlers (via <code className="font-mono bg-muted px-1 py-0.5 rounded">handle(app)</code>). Don&apos;t create Next Route Handlers.
                </CardContent>
              </Card>
              <Card className="border-red-200 dark:border-red-900 bg-white dark:bg-zinc-900 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-red-600" /> 2. JWT — No OAuth Needed</CardTitle>
                </CardHeader>
                <CardContent className="text-xs leading-6 text-muted-foreground">
                  Use <code className="font-mono bg-muted px-1 py-0.5 rounded">jose</code> JWT <code className="font-mono bg-muted px-1 py-0.5 rounded">{"{email, role}"}</code> in <code className="font-mono bg-muted px-1 py-0.5 rounded">httpOnly</code> <code className="font-mono bg-muted px-1 py-0.5 rounded">auth_token</code> cookies via <code className="font-mono bg-muted px-1 py-0.5 rounded">hono/cookie</code> — not <code className="font-mono bg-muted px-1 py-0.5 rounded">localStorage</code>. <span className="font-semibold text-foreground">Placeholders — <code className="font-mono bg-muted px-1 py-0.5 rounded">lib/auth/jwt.ts</code>, <code className="font-mono bg-muted px-1 py-0.5 rounded">lib/auth/guard.ts</code>, <code className="font-mono bg-muted px-1 py-0.5 rounded">JWT_SECRET</code> owned by <code className="font-mono bg-muted px-1 py-0.5 rounded">team/auth</code>.</span> Take inspiration from <a href="https://github.com/real-zephex/Auth-Api" target="_blank" rel="noreferrer" className="underline decoration-dotted">real-zephex/Auth-Api</a> (<code className="font-mono bg-muted px-1 py-0.5 rounded">src/index.ts</code> + <code className="font-mono bg-muted px-1 py-0.5 rounded">lib/auth/jwt.ts</code>). Other teams: just <code className="font-mono bg-muted px-1 py-0.5 rounded">import &#123; requireRole &#125; from &quot;@/lib/auth/guard&quot;</code> once it lands.
                </CardContent>
              </Card>
              <Card className="border-red-200 dark:border-red-900 bg-white dark:bg-zinc-900 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-mono flex items-center gap-1.5"><TriangleAlert className="h-3.5 w-3.5 text-red-600" /> 3. Hash + Salt</CardTitle>
                </CardHeader>
                <CardContent className="text-xs leading-6 text-muted-foreground">
                  Main site: <code className="font-mono bg-muted px-1 py-0.5 rounded">bcrypt.hash(password, 12)</code> or <code className="font-mono bg-muted px-1 py-0.5 rounded">argon2id</code> — salt is automatic. Never plaintext or <code className="font-mono bg-muted px-1 py-0.5 rounded">MD5/SHA1/SHA256(pw)</code>. Insecure demo (<code className="font-mono bg-muted px-1 py-0.5 rounded">app/demo/insecure-auth</code>) comes later, isolated with ⚠️ banner.
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 rounded-xl border bg-white dark:bg-zinc-900 p-4">
              <div className="text-xs font-semibold flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> Secure edit — copy pattern</div>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-950 text-zinc-100 p-3 text-xs font-mono leading-5 border border-zinc-800">{`// app/api/[[...route]]/route.ts — Hono (Auth-Api pattern)
// All /api/* via single Hono app + handle(app)
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { requireRole } from "@/lib/auth/guard"; // PLACEHOLDER — team/auth
import { createPostSchema } from "@/lib/your-module/schema";

const app = new Hono().basePath("/api");
app.post("/your-module/update", async (c) => {
  const user = await requireRole(c, ["admin", "editor"]); // via getCookie(c,"auth_token") + jose
  const parsed = createPostSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  return c.json({ ok: true });
});
// see https://github.com/real-zephex/Auth-Api/blob/main/src/index.ts`}</pre>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="font-mono text-[11px]">zod</Badge>
                <Badge variant="secondary" className="font-mono text-[11px]">react-hook-form</Badge>
                <Badge variant="secondary" className="font-mono text-[11px]">jose</Badge>
                <Badge variant="secondary" className="font-mono text-[11px]">bcryptjs / argon2</Badge>
                <Badge variant="outline" className="font-mono text-[11px]">httpOnly cookie</Badge>
              </div>
            </div>

            <Alert className="mt-4 bg-white dark:bg-zinc-900 border-red-200 dark:border-red-900">
              <TriangleAlert className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-xs font-semibold">Main site stays secure — demo comes later</AlertTitle>
              <AlertDescription className="text-xs leading-6">
                The insecure demo (plaintext + unsalted SHA256, same password → same hash reveals reuse) will be added under <code className="font-mono bg-muted px-1 py-0.5 rounded">app/demo/insecure-auth</code> only — clearly labelled <code className="font-mono bg-muted px-1 py-0.5 rounded">⚠️ Educational — do not copy</code>. Never ship demo code to main routes. Full guide: <code className="font-mono bg-muted px-1 py-0.5 rounded">SECURITY.md</code> at repo root.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator />
      </div>


      {/* FORMS — ZOD + REACT-HOOK-FORM (AURAEDGE PATTERN) */}
      <section id="validation" className="mx-auto max-w-6xl px-6 py-10 md:py-14 scroll-mt-16">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          <FileCode2 className="h-3.5 w-3.5" /> Forms & Validation
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Validate with <span className="font-mono text-lg">zod</span> + <span className="font-mono text-lg">react-hook-form</span></h2>
          <Badge variant="secondary" className="font-mono text-xs">Follow AuraEdge register pattern</Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground max-w-3xl">
          One <code className="font-mono bg-muted px-1 py-0.5 rounded">zod</code> schema, reused client + Hono server. Client resolver is for UX, Hono <code className="font-mono bg-muted px-1 py-0.5 rounded">safeParse</code> in <code className="font-mono bg-muted px-1 py-0.5 rounded">app/api/[[...route]]/route.ts</code> is for security. Copy <a href="https://raw.githubusercontent.com/real-zephex/auraedge-website/refs/heads/main/app/register/page.tsx" target="_blank" rel="noreferrer" className="underline decoration-dotted">AuraEdge register</a> + <a href="https://github.com/real-zephex/Auth-Api" target="_blank" rel="noreferrer" className="underline decoration-dotted">Auth-Api/src/index.ts</a>.
        </p>

        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          {/* Step 1: Schema */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono flex items-center gap-2">1. Define schema → infer type</CardTitle>
              <CardDescription className="text-xs">lib/&lt;module&gt;/schema.ts — single source of truth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-zinc-950 text-zinc-100 p-3.5 text-xs font-mono leading-5 overflow-x-auto">
                <div className="text-zinc-400">// lib/your-module/schema.ts</div>
                <div>import * as z from &quot;zod&quot;;</div>
                <div className="mt-2">export const createPostSchema = z.object(&#123;</div>
                <div className="pl-3">title: z.string().min(3, &quot;≥3 chars&quot;),</div>
                <div className="pl-3">content: z.string().min(20, &quot;≥20 chars&quot;),</div>
                <div className="pl-3">category: z.enum([&quot;xss&quot;,&quot;sqli&quot;,&quot;phishing&quot;]),</div>
                <div className="pl-3">email: z.string().email(&quot;Valid email&quot;),</div>
                <div className="pl-3">agreeToTerms: z.boolean().refine(v =&gt; v, &#123;</div>
                <div className="pl-6">message: &quot;You must accept&quot;</div>
                <div className="pl-3">&#125;),</div>
                <div>&#125;);</div>
                <div className="mt-2 text-emerald-400">export type CreatePostInput = z.infer&lt;typeof createPostSchema&gt;;</div>
                <div className="mt-2 text-zinc-400">// AuraEdge: registerSchema + z.infer — never hand-type the form type</div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: useForm with resolver */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono flex items-center gap-2">2. useForm + zodResolver (AuraEdge exactly)</CardTitle>
              <CardDescription className="text-xs">useForm&lt;T&gt; with resolver, defaultValues, register, errors, isSubmitting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-zinc-950 text-zinc-100 p-3.5 text-xs font-mono leading-5 overflow-x-auto">
                <div>import &#123; useForm &#125; from &quot;react-hook-form&quot;;</div>
                <div>import &#123; zodResolver &#125; from &quot;@hookform/resolvers/zod&quot;;</div>
                <div className="mt-2">const &#123; register, handleSubmit, setValue, watch,</div>
                <div className="pl-3">formState: &#123; errors, isSubmitting &#125;</div>
                <div>&#125; = useForm&lt;CreatePostInput&gt;(&#123;</div>
                <div className="pl-3">resolver: zodResolver(createPostSchema),</div>
                <div className="pl-3">defaultValues: &#123; category: &quot;xss&quot;, isPublished: false &#125;</div>
                <div>&#125;);</div>
                <div className="mt-2 text-zinc-400">// Every input: &#123;...register(&quot;title&quot;)&#125; + &#123;errors.title?.message&#125; below</div>
                <div className="mt-2">&lt;Input &#123;...register(&quot;title&quot;)&#125; /&gt;</div>
                <div className="text-red-400">&#123;errors.title &amp;&amp; &lt;p&gt;&#123;errors.title.message&#125;&lt;/p&gt;&#125;</div>
                <div className="mt-1 text-zinc-400">// setValue/watch for auto-populate — AuraEdge: setValue(&quot;email&quot;, user.email)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Steps 3 & 4 full width */}
        <div className="mt-4 grid lg:grid-cols-2 gap-4">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono flex items-center gap-2">3. Form JSX — copy AuraEdge field pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-zinc-950 text-zinc-100 p-3.5 text-xs font-mono leading-5 overflow-x-auto">
                <div>&lt;form onSubmit=&#123;handleSubmit(onSubmit)&#125;&gt;</div>
                <div className="pl-2">&lt;Label&gt;Title *&lt;/Label&gt;</div>
                <div className="pl-2">&lt;Input &#123;...register(&quot;title&quot;)&#125; placeholder=&quot;Stored XSS demo&quot; /&gt;</div>
                <div className="pl-2 text-red-400">&#123;errors.title &amp;&amp; &lt;p className=&quot;text-xs text-red-400&quot;&gt;&#123;errors.title.message&#125;&lt;/p&gt;&#125;</div>
                <div className="mt-2 pl-2">&lt;Textarea &#123;...register(&quot;content&quot;)&#125; /&gt;</div>
                <div className="pl-2 text-red-400">&#123;errors.content &amp;&amp; ...&#125;</div>
                <div className="mt-2 pl-2">&lt;select &#123;...register(&quot;category&quot;)&#125;&gt;&lt;option value=&quot;xss&quot;&gt;...&lt;/select&gt;</div>
                <div className="pl-2">&lt;input type=&quot;checkbox&quot; &#123;...register(&quot;agreeToTerms&quot;)&#125; /&gt;</div>
                <div className="mt-2 pl-2 text-zinc-400">// AuraEdge: &lt;Input &#123;...register(&quot;email&quot;)&#125; /&gt; + &lt;p&gt;&#123;errors.email.message&#125;&lt;/p&gt; per field</div>
                <div className="pl-2">&lt;Button disabled=&#123;isSubmitting&#125;&gt;&#123;isSubmitting ? &quot;Submitting...&quot; : &quot;Submit&quot;&#125;&lt;/Button&gt;</div>
                <div>&lt;/form&gt;</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="font-mono text-[11px]">register</Badge>
                <Badge variant="secondary" className="font-mono text-[11px]">handleSubmit</Badge>
                <Badge variant="secondary" className="font-mono text-[11px]">errors.*.message</Badge>
                <Badge variant="secondary" className="font-mono text-[11px]">isSubmitting</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono flex items-center gap-2"><TriangleAlert className="h-3.5 w-3.5 text-amber-600" /> 4. Re-validate on server — never trust client</CardTitle>
              <CardDescription className="text-xs">Attacker can curl your API. safeParse before Drizzle. <span className="font-semibold">requireRole is a placeholder from team/auth.</span></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-zinc-950 text-zinc-100 p-3.5 text-xs font-mono leading-5 overflow-x-auto">
                <div>// app/api/[[...route]]/route.ts — Hono (see Auth-Api/src/index.ts)</div>
                <div>import &#123; requireRole &#125; from &quot;@/lib/auth/guard&quot;; // placeholder — team/auth</div>
                <div>import &#123; createPostSchema &#125; from &quot;@/lib/your-module/schema&quot;;</div>
                <div className="mt-2">app.post(&quot;/your-module/create&quot;, async (c) =&gt; &#123;</div>
                <div className="pl-3 text-emerald-400">const user = await requireRole(c, [&quot;admin&quot;]); // getCookie(c,&quot;auth_token&quot;) + jose</div>
                <div className="pl-3">const raw = await c.req.json();</div>
                <div className="pl-3">const parsed = createPostSchema.safeParse(raw);</div>
                <div className="pl-3">if (!parsed.success) return c.json(&#123; error: parsed.error.flatten() &#125;, 400);</div>
                <div className="pl-3">await db.insert(posts).values(&#123; ...parsed.data, ownerId: user.userId &#125;);</div>
                <div className="pl-3">return c.json(&#123; ok: true &#125;, 201);</div>
                <div>&#125;);</div>
                <div className="mt-2 text-zinc-400">// Client zodResolver = UX, server safeParse = security</div>
              </div>
              <Alert className="mt-3 bg-white dark:bg-zinc-900 border-amber-200 dark:border-amber-900 py-2">
                <AlertDescription className="text-xs leading-5">Every mutation: <code className="font-mono bg-muted px-1 py-0.5 rounded">requireRole()</code> → <code className="font-mono bg-muted px-1 py-0.5 rounded">schema.safeParse()</code> → <code className="font-mono bg-muted px-1 py-0.5 rounded">db.*</code></AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 rounded-xl border bg-muted/30 p-4 text-xs leading-6">
          <div className="font-semibold">Checklist — did you follow AuraEdge?</div>
          <div className="mt-1 grid sm:grid-cols-2 gap-1 text-muted-foreground">
            <div>• <code className="font-mono bg-background border px-1 py-0.5 rounded">z.infer&lt;typeof schema&gt;</code> for the form type</div>
            <div>• <code className="font-mono bg-background border px-1 py-0.5 rounded">zodResolver(schema)</code> + <code className="font-mono bg-background border px-1 py-0.5 rounded">defaultValues</code> per field/enum</div>
            <div>• <code className="font-mono bg-background border px-1 py-0.5 rounded">&#123;...register(&quot;field&quot;)&#125;</code> on every input/select/checkbox</div>
            <div>• <code className="font-mono bg-background border px-1 py-0.5 rounded">&#123;errors.field?.message&#125;</code> under each field</div>
            <div>• <code className="font-mono bg-background border px-1 py-0.5 rounded">setValue/watch</code> when auto-populating</div>
            <div>• Re-parse with <code className="font-mono bg-background border px-1 py-0.5 rounded">safeParse</code> on server before <code className="font-mono bg-background border px-1 py-0.5 rounded">db</code></div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator />
      </div>


      {/* DEMO — LIVE ZOD + REACT-HOOK-FORM + HONO */}
      <section id="demo" className="mx-auto max-w-6xl px-6 py-10 md:py-14 scroll-mt-16">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-violet-600" /> Live Demo
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Try it — validation before & after submit</h2>
          <Badge variant="outline" className="font-mono text-xs border-violet-200 text-violet-700 dark:border-violet-900 dark:text-violet-300">POST /api/demo/post → {"{ message: \"message received\" }"} </Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground max-w-3xl">
          Fill the fields with anything random — <code className="font-mono bg-muted px-1 py-0.5 rounded">zodResolver</code> (<code className="font-mono bg-muted px-1 py-0.5 rounded">mode: &quot;onChange&quot;</code>) blocks submit until the data is valid. On submit it hits <code className="font-mono bg-muted px-1 py-0.5 rounded">Hono POST /api/demo/post</code>, re-validates with <code className="font-mono bg-muted px-1 py-0.5 rounded">demoPostSchema.safeParse</code>, then replies <span className="font-semibold text-foreground">message received</span>. This is the exact flow your team must copy.
        </p>
        <Alert className="mt-4 bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900">
          <Shield className="h-4 w-4 text-violet-600" />
          <AlertTitle className="text-xs font-semibold font-mono">How it mirrors your team code</AlertTitle>
          <AlertDescription className="text-xs leading-6">
            <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">lib/demo/schema.ts</code> → one <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">zod</code> schema, <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">z.infer</code> type. Client: <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">useForm(&#123; resolver: zodResolver(schema) &#125;)</code> (<a href="https://raw.githubusercontent.com/real-zephex/auraedge-website/refs/heads/main/app/register/page.tsx" target="_blank" rel="noreferrer" className="underline decoration-dotted">AuraEdge pattern</a>). Server: <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">app/api/[[...route]]/route.ts — app.post(&quot;/demo/post&quot;, ...)</code> (<a href="https://github.com/real-zephex/Auth-Api" target="_blank" rel="noreferrer" className="underline decoration-dotted">Auth-Api/Hono</a>). Replace <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">demoPostSchema</code> with your module schema and add <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">requireRole(c, [...])</code> (placeholder — <code className="font-mono bg-white dark:bg-zinc-900 border px-1 py-0.5 rounded">team/auth</code>) in Hono before the DB call.
          </AlertDescription>
        </Alert>

        <div className="mt-6">
          <DemoForm />
        </div>

        <div className="mt-4 rounded-xl border bg-muted/30 p-4">
          <div className="text-xs font-semibold flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5" /> Try bypassing the client — Hono still blocks you</div>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-950 text-zinc-100 p-3 text-xs font-mono leading-5 border border-zinc-800">{`# invalid — server safeParse rejects (try it!)
curl -X POST http://localhost:3000/api/demo/post \
  -H "Content-Type: application/json" \
  -d '{"email":"bad","message":"hi"}'
# → {"error":"Validation failed on server","details":{...}}

# valid — message received
curl -X POST http://localhost:3000/api/demo/post \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Ada Lovelace","email":"ada@ltsu.ac.in","team":"team/demo","module":"auth","message":"Hello from demo — this is a valid message!","agreeToTerms":true}'
# → {"message":"message received","data":{...}}`}</pre>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator />
      </div>

      <section id="rules" className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Contribution Rules
        </div>
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
          Read carefully — violations are rejected instantly
        </h2>

        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          {/* Allowed */}
          <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/10 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <span className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </span>
                What you MAY edit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border bg-card p-4">
                <div className="font-mono text-xs font-semibold flex items-center gap-1.5">
                  <FileCode2 className="h-3.5 w-3.5" /> lib/schema.ts{" "}
                  <Badge variant="secondary" className="ml-1 text-[10px]">
                    ★ ONLY shared file
                  </Badge>
                </div>
                <p className="text-xs leading-6 text-muted-foreground mt-1">
                  Add your tables here. Coordinate table names to avoid
                  collisions.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="font-mono text-xs font-semibold flex items-center gap-1.5">
                  <FolderTree className="h-3.5 w-3.5" />{" "}
                  app/&lt;your-route&gt;/**
                </div>
                <p className="text-xs leading-6 text-muted-foreground mt-1">
                  Create{" "}
                  <span className="font-semibold text-foreground">
                    new routes
                  </span>{" "}
                  for your feature. Never modify another team&apos;s route.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="font-mono text-xs font-semibold flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> lib/&lt;your-module&gt;/**
                </div>
                <p className="text-xs leading-6 text-muted-foreground mt-1">
                  All helpers, queries, utils, types — e.g.{" "}
                  <code className="font-mono bg-muted px-1 py-0.5 rounded">
                    lib/phishing/utils.ts
                  </code>
                </p>
              </div>
              <div className="rounded-lg bg-emerald-600 text-white p-3 text-xs leading-6">
                <span className="font-semibold">Unified code?</span> Create new
                files under{" "}
                <code className="font-mono bg-white/20 px-1 py-0.5 rounded">
                  lib/
                </code>{" "}
                — e.g.{" "}
                <code className="font-mono bg-white/20 px-1 py-0.5 rounded">
                  lib/shared/constants.ts
                </code>
                . Discuss with lead first. Never modify existing shared files.
              </div>
            </CardContent>
          </Card>

          {/* Forbidden */}
          <Card className="border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/10 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-red-800 dark:text-red-200">
                <span className="h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center">
                  <Ban className="h-4 w-4" />
                </span>
                What you MUST NOT edit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border bg-card p-4 flex gap-3">
                <TriangleAlert className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-xs font-semibold">
                    NEVER touch package.json
                  </div>
                  <p className="text-xs leading-6 text-muted-foreground">
                    Adding/removing deps via branches is forbidden. Need a
                    package? Request it from the lead.{" "}
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      Branch will be rejected instantly.
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4 flex gap-3">
                <X className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-xs font-semibold">
                    Never edit files you don&apos;t own
                  </div>
                  <p className="text-xs leading-6 text-muted-foreground">
                    Don&apos;t touch{" "}
                    <code className="font-mono bg-muted px-1 py-0.5 rounded">
                      app/layout.tsx
                    </code>
                    ,{" "}
                    <code className="font-mono bg-muted px-1 py-0.5 rounded">
                      app/page.tsx
                    </code>
                    ,{" "}
                    <code className="font-mono bg-muted px-1 py-0.5 rounded">
                      lib/turso.ts
                    </code>
                    ,{" "}
                    <code className="font-mono bg-muted px-1 py-0.5 rounded">
                      lib/utils.ts
                    </code>
                    ,{" "}
                    <code className="font-mono bg-muted px-1 py-0.5 rounded">
                      drizzle.config.ts
                    </code>
                    ,{" "}
                    <code className="font-mono bg-muted px-1 py-0.5 rounded">
                      components/ui/*
                    </code>{" "}
                    or another team&apos;s folder.
                  </p>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4 flex gap-3">
                <Lock className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-xs font-semibold">
                    Never commit secrets
                  </div>
                  <p className="text-xs leading-6 text-muted-foreground">
                    <code className="font-mono bg-muted px-1 py-0.5 rounded">
                      .env.local
                    </code>{" "}
                    is gitignored. Never commit it. Don&apos;t edit{" "}
                    <code className="font-mono bg-muted px-1 py-0.5 rounded">
                      drizzle/
                    </code>{" "}
                    manually — it&apos;s generated.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Correct vs Wrong */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Card className="overflow-hidden border-emerald-200 dark:border-emerald-900 shadow-sm">
            <div className="h-1 bg-emerald-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Check className="h-3.5 w-3.5" /> ✅ CORRECT — team
                &quot;xss&quot;
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-4 text-xs font-mono leading-6 border border-zinc-800 overflow-x-auto">{`app/xss/page.tsx
app/xss/components/XssDemo.tsx
lib/xss/queries.ts
lib/xss/validator.ts
lib/schema.ts  # added xssAttempts table`}</pre>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-red-200 dark:border-red-900 shadow-sm">
            <div className="h-1 bg-red-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono flex items-center gap-2 text-red-700 dark:text-red-300">
                <X className="h-3.5 w-3.5" /> ❌ WRONG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-4 text-xs font-mono leading-6 border border-zinc-800 overflow-x-auto">{`package.json           # NEVER
app/page.tsx           # belongs to root
lib/turso.ts           # don't edit
lib/other-team/helper  # don't touch`}</pre>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Separator />
      </div>

      {/* STYLING & SCRIPTS */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" /> Styling & UI
              </CardTitle>
              <CardDescription className="text-xs leading-6">
                Tailwind for styling, shadcn for components, TypeScript strict.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border bg-muted/30 p-3 text-xs leading-6">
                <div>
                  Use <span className="font-semibold">Tailwind CSS</span>{" "}
                  utility classes for all styling.
                </div>
                <div className="mt-1">
                  Import <span className="font-semibold">shadcn/ui</span> from{" "}
                  <code className="font-mono bg-background border px-1 py-0.5 rounded">
                    @/components/ui
                  </code>
                  .
                </div>
                <div className="mt-1 text-muted-foreground">
                  Keep TypeScript strict — no{" "}
                  <code className="font-mono bg-background border px-1 py-0.5 rounded">
                    any
                  </code>{" "}
                  without justification.
                </div>
              </div>
              <CodeBlock
                lang="bash"
                code={`npx shadcn@latest add button --yes
# ask lead first — modifies components.json`}
              />
              <div className="flex flex-wrap gap-1.5">
                {[
                  "tailwind-merge",
                  "clsx",
                  "lucide-react",
                  "tw-animate-css",
                ].map((p) => (
                  <Badge
                    key={p}
                    variant="secondary"
                    className="font-mono text-[11px]"
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Scripts
              </CardTitle>
              <CardDescription className="text-xs">
                Run with{" "}
                <code className="font-mono bg-muted px-1 py-0.5 rounded">
                  bun run &lt;script&gt;
                </code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="text-left font-mono font-semibold px-3 py-2">
                        Command
                      </th>
                      <th className="text-left px-3 py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-xs">
                    <tr>
                      <td className="px-3 py-2.5">bun dev</td>
                      <td className="px-3 py-2.5 font-sans text-muted-foreground">
                        Start dev server
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5">bun run build</td>
                      <td className="px-3 py-2.5 font-sans text-muted-foreground">
                        Production build
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5">bun run lint</td>
                      <td className="px-3 py-2.5 font-sans text-muted-foreground">
                        ESLint
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5">bun run db:generate</td>
                      <td className="px-3 py-2.5 font-sans text-muted-foreground">
                        Generate SQL from schema
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5">bun run db:migrate</td>
                      <td className="px-3 py-2.5 font-sans text-muted-foreground">
                        Apply to Turso
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5">bun run db:push</td>
                      <td className="px-3 py-2.5 font-sans text-muted-foreground">
                        Push directly (dev)
                      </td>
                    </tr>
                    <tr className="bg-emerald-50 dark:bg-emerald-950/20">
                      <td className="px-3 py-2.5 font-semibold text-emerald-700 dark:text-emerald-300">
                        bun run db:sync
                      </td>
                      <td className="px-3 py-2.5 font-sans font-medium">
                        Generate + migrate + push
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 rounded-lg bg-zinc-950 text-zinc-100 p-3 flex items-center justify-between">
                <code className="font-mono text-xs">
                  bunx drizzle-kit studio
                </code>
                <span className="text-xs text-zinc-400">
                  optional — DB studio
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>
                Built with Next.js • Tailwind CSS • shadcn/ui • TypeScript •
                Turso
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Need help? Check</span>
              <code className="px-1.5 py-0.5 bg-background border rounded font-mono">
                AGENTS.md
              </code>
              <span>or ping the lead. Never force-push to main.</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-muted-foreground">
            <span>© 2026 Ethical Hacking Project</span>
            <span>•</span>
            <span>Semester 5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
