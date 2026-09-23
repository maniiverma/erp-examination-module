"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demoPostSchema, type DemoPostInput } from "@/lib/demo/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Send, Loader2, Sparkles, Shield } from "lucide-react";

type ApiResult =
  | { ok: true; body: { message: string; data: DemoPostInput; at: string; note: string } }
  | { ok: false; body: { error: string; details?: unknown; message?: string } };

export function DemoForm() {
  const [result, setResult] = useState<ApiResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DemoPostInput>({
    resolver: zodResolver(demoPostSchema),
    mode: "onChange", // validates as they type — before submit
    defaultValues: {
      fullName: "",
      email: "",
      team: "",
      module: undefined as unknown as DemoPostInput["module"],
      message: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: DemoPostInput) => {
    setResult(null);
    const res = await fetch("/api/demo/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setResult({ ok: true, body });
    else setResult({ ok: false, body });
  };

  const onError = () => {
    setResult({
      ok: false,
      body: { error: "Client validation failed", message: "Fix the highlighted fields — zodResolver blocked submit." },
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-foreground text-background flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </span>
            <CardTitle className="text-base tracking-tight">Live Demo — Try the form</CardTitle>
            <Badge variant="secondary" className="ml-auto font-mono text-[11px]">zod + react-hook-form + Hono</Badge>
          </div>
          <CardDescription className="text-xs leading-5">
            Type anything — <span className="font-semibold text-foreground">zod validates before submit</span> (<code className="font-mono bg-muted px-1 py-0.5 rounded">mode: &quot;onChange&quot;</code>). On submit it hits <code className="font-mono bg-muted px-1 py-0.5 rounded">POST /api/demo/post</code> (Hono), re-validates with <code className="font-mono bg-muted px-1 py-0.5 rounded">safeParse</code>, then replies <code className="font-mono bg-muted px-1 py-0.5 rounded">message received</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono">Full Name *</Label>
                <Input {...register("fullName")} placeholder="Alex Rivera" autoComplete="name" />
                {errors.fullName && <p className="text-xs text-red-500 font-mono">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-mono">Email *</Label>
                <Input {...register("email")} placeholder="alex@ltsu.ac.in" autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500 font-mono">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono">Team *</Label>
                <Input {...register("team")} placeholder="team/xss-demo" />
                {errors.team && <p className="text-xs text-red-500 font-mono">{errors.team.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-mono">Module *</Label>
                <select
                  {...register("module")}
                  defaultValue=""
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>Pick one</option>
                  <option value="xss">XSS</option>
                  <option value="sqli">SQLi</option>
                  <option value="phishing">Phishing</option>
                  <option value="csrf">CSRF</option>
                  <option value="auth">Auth</option>
                </select>
                {errors.module && <p className="text-xs text-red-500 font-mono">{errors.module.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono">Message * (10–500 chars)</Label>
              <Textarea {...register("message")} placeholder="What do you want to build? (min 10 chars)" className="min-h-[96px]" />
              {errors.message && <p className="text-xs text-red-500 font-mono">{errors.message.message}</p>}
              {!errors.message && <p className="text-xs text-muted-foreground font-mono">Try a short message — zod will block it before it ever hits the backend.</p>}
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-muted/30 cursor-pointer text-sm">
              <input type="checkbox" {...register("agreeToTerms")} className="mt-1" />
              <span className="text-xs leading-5">I agree to the demo terms (validation is enforced client <em>and</em> server-side) *</span>
            </label>
            {errors.agreeToTerms && <p className="text-xs text-red-500 font-mono">{errors.agreeToTerms.message}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-xl">
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send to Hono</>}
            </Button>

            <p className="text-xs font-mono text-center text-muted-foreground">
              Client hits <code className="bg-muted px-1 py-0.5 rounded">zodResolver</code> on change → submit blocked until valid → then <code className="bg-muted px-1 py-0.5 rounded">POST /api/demo/post</code> → Hono <code className="bg-muted px-1 py-0.5 rounded">demoPostSchema.safeParse</code>
            </p>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              {result == null && <><span className="h-2 w-2 rounded-full bg-zinc-300" /> Waiting for submit</>}
              {result?.ok && <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Server reply</>}
              {result && !result.ok && <><AlertCircle className="h-4 w-4 text-red-600" /> Blocked</>}
            </CardTitle>
            <CardDescription className="text-xs">
              Left = client <code className="font-mono bg-muted px-1 py-0.5 rounded">zodResolver</code> (instant). Right = Hono <code className="font-mono bg-muted px-1 py-0.5 rounded">safeParse</code> (after fetch).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result == null ? (
              <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center space-y-2">
                <Sparkles className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Submit the form to see the backend response here.</p>
                <p className="text-xs font-mono text-muted-foreground">Success → <code className="bg-background border px-1 py-0.5 rounded">{"{ message: 'message received' }"}</code></p>
              </div>
            ) : result.ok ? (
              <div className="space-y-3">
                <Alert className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertTitle className="text-emerald-800 dark:text-emerald-200 text-sm font-mono">message received</AlertTitle>
                  <AlertDescription className="text-xs leading-5 text-emerald-900 dark:text-emerald-100">
                    {result.body.note} at <code className="font-mono bg-emerald-100 dark:bg-emerald-900 px-1 py-0.5 rounded">{new Date(result.body.at).toLocaleString()}</code>
                  </AlertDescription>
                </Alert>
                <div className="rounded-xl border bg-zinc-950 text-zinc-100 p-3 overflow-auto">
                  <div className="text-xs font-mono text-zinc-400 mb-1">Hono → c.json(...) — status 200</div>
                  <pre className="text-xs font-mono leading-5 whitespace-pre-wrap break-all">{JSON.stringify(result.body, null, 2)}</pre>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setResult(null); reset(); }} className="rounded-full">Send another</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800 dark:text-red-200 text-sm font-mono">{result.body.error}</AlertTitle>
                  <AlertDescription className="text-xs leading-5 text-red-900 dark:text-red-100">
                    {result.body.message ?? "Check the details below."}
                  </AlertDescription>
                </Alert>
                <div className="rounded-xl border bg-zinc-950 text-zinc-100 p-3 overflow-auto max-h-[260px]">
                  <div className="text-xs font-mono text-zinc-400 mb-1">Status {String((result.body as Record<string, unknown>).details ? "400" : "400")} — try bypassing with curl</div>
                  <pre className="text-xs font-mono leading-5 whitespace-pre-wrap break-all">{JSON.stringify(result.body, null, 2)}</pre>
                </div>
                <p className="text-xs font-mono text-muted-foreground">
                  Tip: even if you bypass the form, Hono&apos;s <code className="bg-muted px-1 py-0.5 rounded">safeParse</code> still blocks it. That&apos;s why we validate twice.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> The pattern you must copy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs leading-5 text-muted-foreground">
            <div><span className="font-mono bg-background border px-1 py-0.5 rounded">lib/demo/schema.ts</span> — one <code className="font-mono bg-background border px-1 py-0.5 rounded">zod</code> schema, <code className="font-mono bg-background border px-1 py-0.5 rounded">z.infer</code> for the form type</div>
            <div><span className="font-mono bg-background border px-1 py-0.5 rounded">useForm(&#123; resolver: zodResolver(schema), mode: &quot;onChange&quot; &#125;)</span> — validates before submit</div>
            <div><span className="font-mono bg-background border px-1 py-0.5 rounded">app/api/[[...route]]/route.ts</span> — <code className="font-mono bg-background border px-1 py-0.5 rounded">app.post(&quot;/demo/post&quot;, ... safeParse ...)</code> — never trust the client</div>
            <Separator className="my-2" />
            <div className="text-xs font-mono bg-background border rounded-lg p-2 overflow-auto">
              curl -X POST /api/demo/post -H &apos;Content-Type: application/json&apos; -d &apos;&#123;&quot;email&quot;:&quot;bad&quot;&#125;&apos; → 400
            </div>
            <div className="text-xs">
              In your team route do the same: <code className="font-mono bg-background border px-1 py-0.5 rounded">requireRole(c, [&quot;editor&quot;])</code> (placeholder — <code className="font-mono bg-background border px-1 py-0.5 rounded">team/auth</code>) → <code className="font-mono bg-background border px-1 py-0.5 rounded">schema.safeParse</code> → <code className="font-mono bg-background border px-1 py-0.5 rounded">db</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
