export const dynamic = "force-static";

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { db } from "@/lib/turso";
import { 
  users, 
  examSchedules, 
  admitCardsTable,
  examMarks as studentMarks, // Alias examMarks to studentMarks to resolve import error
  reEvaluationTickets, 
  paperVault, 
  auditLogs, 
  examSeating, 
  umcIncidents,
  issuedQrPasses
} from "@/lib/schema";
import { eq, or, desc, sql } from "drizzle-orm";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

// Set Node.js runtime explicitly to eliminate Edge Runtime deprecation warning
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

// Helper: Ensure Database Health & Column Guards
async function ensureDbInit() {
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        roll_no TEXT,
        employee_id TEXT,
        assigned_subject TEXT,
        department TEXT NOT NULL,
        program TEXT NOT NULL DEFAULT 'B.Tech CSE',
        phone TEXT,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        approved_by TEXT,
        fee_clearance TEXT NOT NULL DEFAULT 'CLEARED',
        created_at TEXT NOT NULL
      );
    `);
    try { await db.run(sql`ALTER TABLE users ADD COLUMN assigned_subject TEXT;`); } catch (e) {}
    try { await db.run(sql`ALTER TABLE users ADD COLUMN fee_clearance TEXT DEFAULT 'CLEARED';`); } catch (e) {}
    try { await db.run(sql`ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'ACTIVE';`); } catch (e) {}

    // Seed Master Admin
    await db.run(sql`
      INSERT OR REPLACE INTO users (id, name, email, password, role, department, program, status, fee_clearance, created_at)
      VALUES ('admin-01', 'Controller of Examinations', 'admin@ltsu.ac.in', 'admin123', 'admin', 'Central Examination Branch', 'Administration', 'ACTIVE', 'CLEARED', ${new Date().toISOString()});
    `);

    // Seed Faculty
    await db.run(sql`
      INSERT OR REPLACE INTO users (id, name, email, password, role, employee_id, assigned_subject, department, program, status, fee_clearance, created_at)
      VALUES ('faculty-01', 'Dr. H.S. Bains', 'teacher@ltsu.ac.in', 'teacher123', 'teacher', 'EMP-8921', 'CSE-501 (Advanced Cryptography & PKI)', 'School of Engineering & Technology', 'Faculty Evaluator', 'ACTIVE', 'CLEARED', ${new Date().toISOString()});
    `);

    // Seed Student (Both 24100030033@ltsu.ac.in AND student@ltsu.ac.in)
    await db.run(sql`
      INSERT OR REPLACE INTO users (id, name, email, password, role, roll_no, department, program, status, fee_clearance, created_at)
      VALUES ('student-01', 'Manpreet Singh', '24100030033@ltsu.ac.in', 'student123', 'student', '24100030033', 'B.Tech. CSE (Cyber Security)', 'UG Degree', 'ACTIVE', 'CLEARED', ${new Date().toISOString()});
    `);

    await db.run(sql`
      INSERT OR REPLACE INTO users (id, name, email, password, role, roll_no, department, program, status, fee_clearance, created_at)
      VALUES ('student-02', 'Manpreet Singh', 'student@ltsu.ac.in', 'student123', 'student', '24100030033', 'B.Tech. CSE (Cyber Security)', 'UG Degree', 'ACTIVE', 'CLEARED', ${new Date().toISOString()});
    `);
  } catch (err) {
    console.error("DB Auto-Init Warning:", err);
  }
}

async function getAuthUser(c: any) {
  await ensureDbInit();
  const userId = getCookie(c, "ltsu_user_id");
  if (!userId) return null;
  const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return userList.length > 0 ? userList[0] : null;
}

// -------------------------------------------------------------
// AUTH & REGISTRATION
// -------------------------------------------------------------
app.post("/auth/login", async (c) => {
  try {
    await ensureDbInit();
    const { email, password } = await c.req.json();
    const cleanEmail = email.trim().toLowerCase();

    // Direct search matching email or roll number alias
    const userList = await db.select().from(users).where(
      or(
        eq(users.email, cleanEmail),
        eq(users.rollNo, cleanEmail)
      )
    ).limit(1);

    if (userList.length === 0) {
      // Alias fallback check for student
      if (cleanEmail === "student@ltsu.ac.in" || cleanEmail === "24100030033@ltsu.ac.in" || cleanEmail === "24100030033") {
        const studentRecord = {
          id: "student-01",
          name: "Manpreet Singh",
          email: "student@ltsu.ac.in",
          password: "student123",
          role: "student",
          rollNo: "24100030033",
          department: "B.Tech. CSE (Cyber Security)",
          status: "ACTIVE"
        };
        if (password !== studentRecord.password) {
          return c.json({ ok: false, error: "Incorrect password!" }, 401);
        }
        setCookie(c, "ltsu_user_id", studentRecord.id, { path: "/", httpOnly: true, maxAge: 86400 });
        return c.json({ ok: true, user: studentRecord });
      }
      return c.json({ ok: false, error: "No account found with this email!" }, 404);
    }

    const user = userList[0];
    if (user.password !== password) return c.json({ ok: false, error: "Incorrect password!" }, 401);
    if (user.status === "PENDING_APPROVAL") return c.json({ ok: false, error: "Your registration is pending Admin/COE approval." }, 403);
    
    setCookie(c, "ltsu_user_id", user.id, { path: "/", httpOnly: true, maxAge: 86400 });
    return c.json({ ok: true, user });
  } catch (err: any) {
    return c.json({ ok: false, error: err.message }, 500);
  }
});

app.post("/auth/register", async (c) => {
  try {
    await ensureDbInit();
    const body = await c.req.json();
    const { name, email, password, role, rollNo, employeeId, assignedSubject, department, program } = body;
    if (role === "student" && !/^241000300\d{2}$/.test(rollNo)) {
      return c.json({ ok: false, error: "Invalid Roll Number! Format: 241000300XX" }, 400);
    }
    const newUserId = `usr-${Date.now()}`;
    await db.insert(users).values({
      id: newUserId,
      name,
      email: email.trim().toLowerCase(),
      password,
      role,
      rollNo: role === "student" ? rollNo : null,
      employeeId: role === "teacher" ? employeeId : null,
      assignedSubject: role === "teacher" ? assignedSubject : null,
      department: department || "School of Engineering & Technology",
      program: program || "B.Tech CSE (Cyber Security)",
      status: "PENDING_APPROVAL",
      feeClearance: "CLEARED",
      createdAt: new Date().toISOString(),
    });
    return c.json({ ok: true, message: "Registration submitted successfully for Admin approval." }, 201);
  } catch (err: any) {
    return c.json({ ok: false, error: err.message }, 500);
  }
});

app.get("/auth/me", async (c) => {
  const user = await getAuthUser(c);
  if (!user) return c.json({ ok: false, user: null }, 401);
  return c.json({ ok: true, user });
});

app.post("/auth/logout", async (c) => {
  deleteCookie(c, "ltsu_user_id", { path: "/" });
  return c.json({ ok: true });
});

// User Approvals
app.get("/admin/pending-users", async (c) => {
  await ensureDbInit();
  const list = await db.select().from(users).where(eq(users.status, "PENDING_APPROVAL"));
  return c.json({ ok: true, data: list });
});

app.post("/admin/approve-user/:id", async (c) => {
  const id = c.req.param("id");
  await db.update(users).set({ status: "ACTIVE" }).where(eq(users.id, id));
  return c.json({ ok: true, message: "User account activated successfully." });
});

app.post("/admin/reject-user/:id", async (c) => {
  const id = c.req.param("id");
  await db.update(users).set({ status: "REJECTED" }).where(eq(users.id, id));
  return c.json({ ok: true, message: "User registration rejected." });
});

// Static export handler for Catch-All route with output: export
export function generateStaticParams() {
  return [
    { route: [] },
    { route: ["auth", "login"] },
    { route: ["auth", "register"] },
    { route: ["auth", "me"] },
    { route: ["auth", "logout"] },
    { route: ["admin", "pending-users"] },
  ];
}

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);