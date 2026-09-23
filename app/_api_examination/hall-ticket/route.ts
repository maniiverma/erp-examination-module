export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { hallTickets } from "@/lib/schema";

let hallTicketMemoryStore = [
  {
    id: "HT-2026-001",
    studentRoll: "24100030033",
    studentName: "Manpreet Singh",
    examCenter: "LTSU Main Block - Lab 3",
    session: "May - 2026",
    status: "RELEASED",
    approvedBy: "Controller of Examinations",
  },
];

// 1. GET API: Fetch Hall Ticket Status
export async function GET() {
  try {
    const dbList = await db.select().from(hallTickets);
    if (dbList && dbList.length > 0) {
      const combined = [...dbList];
      for (const item of hallTicketMemoryStore) {
        if (!combined.some((d) => d.id === item.id)) {
          combined.push(item as any);
        }
      }
      return NextResponse.json({ success: true, data: combined });
    }
  } catch (err) {
    console.warn("Database hall ticket fallback active.", err);
  }

  return NextResponse.json({ success: true, data: hallTicketMemoryStore });
}

// 2. POST API: Admin / COE Hold or Clear Hall Ticket Status
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, status, studentRoll, studentName, examCenter } = body;

    const existingIndex = hallTicketMemoryStore.findIndex((h) => h.id === id);

    if (existingIndex !== -1) {
      hallTicketMemoryStore[existingIndex].status = status;
    } else {
      const newTicket = {
        id: id || `HT-${Date.now()}`,
        studentRoll: String(studentRoll || "24100030033"),
        studentName: String(studentName || "Candidate"),
        examCenter: String(examCenter || "LTSU Main Block"),
        session: "May - 2026",
        status: String(status || "RELEASED"),
        approvedBy: "COE Clearance Desk",
      };
      hallTicketMemoryStore.unshift(newTicket);
    }

    return NextResponse.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}