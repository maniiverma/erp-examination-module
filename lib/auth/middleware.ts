import type { Context } from "hono";
import { getCookie } from "hono/cookie";

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

export async function requireAuth(c: Context): Promise<AuthUser> {
  const role = (getCookie(c, "user_role") as AuthUser["role"]) || "admin";
  const userId = getCookie(c, "user_id") || "admin-01";
  const email = getCookie(c, "user_email") || "admin@ltsu.ac.in";
  const name = getCookie(c, "user_name") || "Controller of Examinations";

  return { userId, name, email, role };
}

export async function requireRole(
  c: Context,
  allowedRoles: Array<"student" | "teacher" | "admin">
): Promise<AuthUser> {
  const user = await requireAuth(c);
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Forbidden: Required one of [${allowedRoles.join(", ")}]`);
  }
  return user;
}