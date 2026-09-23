export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { marksheets } from "@/lib/schema";

let marksheetMemoryStore = [
  {
    id: "TR-2026-501",
    studentRoll: "24100030033",
    studentName: "Manpreet Singh",
    subjectCode: "CSE-501",
    subjectName: "Advanced Cryptography & PKI",
    internalMarks: 38,
    externalMarks: 45,
    graceMarks: 0,
    totalMarks: 83,
    grade: "A+",
    status: "PUBLISHED",
  },
  {
    id: "TR-2026-502",
    studentRoll: "24100030033",
    studentName: "Manpreet Singh",
    subjectCode: "CSE-502",
    subjectName: "Ethical Hacking & Penetration Testing",
    internalMarks: 35,
    externalMarks: 42,
    graceMarks: 0,
    totalMarks: 77,
    grade: "A",
    status: "PUBLISHED",
  },
];

// Helper to calculate Grade
function calculateGrade(total: number) {
  if (total >= 90) return "O";
  if (total >= 80) return "A+";
  if (total >= 70) return "A";
  if (total >= 60) return "B+";
  if (total >= 50) return "B";
  return "F";
}

// 1. GET API: Fetch Marksheet Data
export async function GET() {
  try {
    const dbList = await db.select().from(marksheets);
    if (dbList && dbList.length > 0) {
      const combined = [...dbList];
      for (const item of marksheetMemoryStore) {
        if (!combined.some((d) => d.id === item.id)) {
          combined.push(item as any);
        }
      }
      return NextResponse.json({ success: true, data: combined });
    }
  } catch (err) {
    console.warn("Database marksheet fallback active.", err);
  }

  return NextResponse.json({ success: true, data: marksheetMemoryStore });
}

// 2. POST API: Submit or Moderated Result Update
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentRoll, studentName, subjectCode, subjectName, internalMarks, externalMarks, graceMarks } = body;

    const internal = Number(internalMarks) || 0;
    const external = Number(externalMarks) || 0;
    const grace = Number(graceMarks) || 0;
    const total = internal + external + grace;
    const grade = calculateGrade(total);

    const newRecord = {
      id: `TR-${Date.now()}`,
      studentRoll: String(studentRoll || "24100030033"),
      studentName: String(studentName || "Candidate"),
      subjectCode: String(subjectCode || "CSE-502"),
      subjectName: String(subjectName || "Subject Evaluation"),
      internalMarks: internal,
      externalMarks: external,
      graceMarks: grace,
      totalMarks: total,
      grade,
      status: "PUBLISHED",
    };

    marksheetMemoryStore.unshift(newRecord);

    try {
      await db.insert(marksheets).values(newRecord);
    } catch (dbErr) {
      console.warn("Marksheet DB insert skipped, runtime active.");
    }

    return NextResponse.json({ success: true, data: newRecord });
  } catch (err) {
    return NextResponse.json({ error: "Invalid Marksheet Payload" }, { status: 400 });
  }
}