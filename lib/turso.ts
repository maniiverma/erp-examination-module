import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });

// import { db } from "@/lib/db";
// import { users } from "@/lib/schema";
//
// await db.insert(users).values({ name: "zephex" });
// const allUsers = await db.select().from(users);
