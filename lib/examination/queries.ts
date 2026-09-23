import { db } from "@/lib/turso";
import { examEnrollments, examMarks } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function getEnrollment(scheduleId: string, studentId: string) {
  return await db
    .select()
    .from(examEnrollments)
    .where(
      and(
        eq(examEnrollments.examScheduleId, scheduleId),
        eq(examEnrollments.studentId, studentId)
      )
    );
}

export async function saveOrUpdateMarks(data: {
  id: string;
  studentRoll: string;
  subjectCode: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
}) {
  const existing = await db
    .select()
    .from(examMarks)
    .where(eq(examMarks.id, data.id));

  if (existing.length > 0) {
    return await db
      .update(examMarks)
      .set({
        internalMarks: data.internalMarks,
        externalMarks: data.externalMarks,
        totalMarks: data.totalMarks,
        grade: data.grade,
      })
      .where(eq(examMarks.id, data.id));
  } else {
    return await db.insert(examMarks).values({
      id: data.id,
      studentRoll: data.studentRoll,
      subjectCode: data.subjectCode,
      internalMarks: data.internalMarks,
      externalMarks: data.externalMarks,
      totalMarks: data.totalMarks,
      marks: data.totalMarks,
      grade: data.grade,
    });
  }
}