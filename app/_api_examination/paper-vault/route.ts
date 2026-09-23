export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { paperVault } from "@/lib/schema";

// In-Memory store for fast fallback sync on localhost
let vaultMemoryStore = [
  {
    id: "PV-8092",
    subjectCode: "CSE-501",
    subjectName: "Advanced Cryptography & PKI",
    examDate: "2026-05-12",
    uploadedBy: "Dr. H.S. Bains",
    paperHash: "0x8F92A1D0992E34C8101F",
    status: "LOCKED",
    createdAt: new Date().toISOString(),
  },
];

// 1. GET API: Fetch all vault papers for Admin / Controller Console
export async function GET() {
  try {
    const dbList = await db.select().from(paperVault);
    if (dbList && dbList.length > 0) {
      const combined = [...dbList];
      for (const item of vaultMemoryStore) {
        if (!combined.some((d) => d.id === item.id)) {
          combined.push(item as any);
        }
      }
      return NextResponse.json({ success: true, data: combined });
    }
  } catch (err) {
    console.warn("Database paper vault fallback active.", err);
  }

  return NextResponse.json({ success: true, data: vaultMemoryStore });
}

// 2. POST API: Faculty / Admin uploads encrypted paper
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subjectCode, subjectName, examDate, uploadedBy, paperHash } = body;

    const newPaper = {
      id: `PV-${Math.floor(1000 + Math.random() * 9000)}`,
      subjectCode: String(subjectCode || "CSE-502"),
      subjectName: String(subjectName || "Ethical Hacking"),
      examDate: String(examDate || new Date().toISOString().split("T")[0]),
      uploadedBy: String(uploadedBy || "Faculty Member"),
      paperHash: String(paperHash || `0x${Math.random().toString(16).substring(2, 12).toUpperCase()}`),
      status: "LOCKED",
      createdAt: new Date().toISOString(),
    };

    vaultMemoryStore.unshift(newPaper);

    try {
      await db.insert(paperVault).values(newPaper);
    } catch (dbErr) {
      console.warn("Paper Vault DB insert skipped, runtime active.");
    }

    return NextResponse.json({ success: true, data: newPaper });
  } catch (err) {
    return NextResponse.json({ error: "Invalid Paper Submission" }, { status: 400 });
  }
}