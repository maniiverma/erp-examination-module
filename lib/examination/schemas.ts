import { z } from "zod";

export const createExamScheduleSchema = z.object({
  examTitle: z.string().min(3),
  program: z.string().min(2),
  faculty: z.string().min(2),
  department: z.string().min(2),
  session: z.string().min(4),
  courseYear: z.string().min(2),
  semester: z.string().min(2),
  examType: z.enum(["Regular Examination", "Re-appear", "Supplementary"]),
  enrollmentStart: z.string().datetime(),
  enrollmentEnd: z.string().datetime(),
  hallticketReleaseDate: z.string().datetime(),
  examCentre: z.string().default("LTSU Main Campus"),
});

export const enterMarksSchema = z.object({
  examScheduleId: z.string(),
  subjectId: z.string(),
  studentId: z.string(),
  internalMarks: z.number().min(0).max(50),
  externalMarks: z.number().min(0).max(100),
});

export const declareResultsSchema = z.object({
  examScheduleId: z.string(),
  subjectId: z.string().optional(),
  isDeclared: z.boolean(),
});

export const applyRecheckingSchema = z.object({
  subjectId: z.string(),
  reason: z.string().min(10),
});