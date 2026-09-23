import * as z from "zod";

// Single schema reused client (zodResolver) + server (safeParse)
// Keep it random/educational — not tied to any team's table
export const demoPostSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string("Enter a valid email address"),
  team: z.string().min(2, "Team name must be at least 2 characters"),
  module: z.enum(["xss", "sqli", "phishing", "csrf", "auth"], {
    message: "Pick a module",
  }),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Max 500 characters"),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the demo terms",
  }),
});

export type DemoPostInput = z.infer<typeof demoPostSchema>;
