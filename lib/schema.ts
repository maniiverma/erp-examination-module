import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. Users Table (Student, Faculty with Subject, Admin)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // "student" | "teacher" | "admin"
  rollNo: text("roll_no"), // Format: 241000300XX
  employeeId: text("employee_id"),
  assignedSubject: text("assigned_subject"), // e.g., "CSE-501 (Advanced Cryptography)"
  department: text("department").notNull(),
  program: text("program").notNull().default("B.Tech CSE"),
  phone: text("phone"),
  status: text("status").notNull().default("ACTIVE"), // "ACTIVE" | "PENDING_APPROVAL" | "REJECTED"
  approvedBy: text("approved_by"),
  feeClearance: text("fee_clearance").notNull().default("CLEARED"),
  createdAt: text("created_at").notNull(),
});

// 2. Exam Schedules Master
export const examSchedules = sqliteTable("exam_schedules", {
  id: text("id").primaryKey(),
  program: text("program").notNull(),
  faculty: text("faculty").notNull(),
  department: text("department").notNull(),
  session: text("session").notNull(),
  courseYear: text("course_year").notNull(),
  semester: text("semester").notNull(),
  examType: text("exam_type").notNull().default("Regular Examination"),
  enrollmentStart: text("enrollment_start").notNull(),
  enrollmentEnd: text("enrollment_end").notNull(),
  hallticketStatus: text("hallticket_status").notNull().default("Not Scheduled"),
  approverStatus: text("approver_status").notNull().default("Approved by COE"),
  examCentre: text("exam_centre").notNull(),
  status: text("status").notNull().default("Open"), // "Open" | "Expired" | "Pending Approval"
  createdAt: text("created_at").notNull(),
});

// 3. Official Admit Cards Ledger (Admin Lifecycle Controls)
export const admitCardsTable = sqliteTable("admit_cards", {
  id: text("id").primaryKey(),
  rollNo: text("roll_no").notNull().unique(),
  studentName: text("student_name").notNull(),
  program: text("program").notNull(),
  department: text("department").notNull(),
  semester: text("semester").notNull(),
  examCentre: text("exam_centre").notNull(),
  hallNumber: text("hall_number").notNull().default("Hall B-201"),
  deskNumber: text("desk_number").notNull().default("Desk #04"),
  passToken: text("pass_token").notNull().unique(),
  status: text("status").notNull().default("APPROVED"), // "APPROVED" | "PENDING" | "DISAPPROVED"
  issuedBy: text("issued_by").notNull(),
  issuedDate: text("issued_date").notNull(),
});

// 4. Seating Matrix & Class Invigilation
export const examSeating = sqliteTable("exam_seating", {
  id: text("id").primaryKey(),
  examScheduleId: text("exam_schedule_id").notNull().default("exam-101"),
  hallNumber: text("hall_number").notNull(),
  deskNumber: text("desk_number").notNull(),
  rowNumber: integer("row_number").notNull().default(1),
  colNumber: integer("col_number").notNull().default(1),
  studentId: text("student_id").notNull(),
  studentName: text("student_name").notNull(),
  rollNo: text("roll_no").notNull(),
  subjectCode: text("subject_code").notNull().default("CSE-502"),
  dummyRollNo: text("dummy_roll_no").notNull(),
  status: text("status").notNull().default("ASSIGNED"), // "ASSIGNED" | "VACANT" | "BLOCKED_UMC"
  attendanceStatus: text("attendance_status").notNull().default("PENDING"), // "PRESENT" | "ABSENT" | "PENDING"
  markedByTeacher: text("marked_by_teacher"),
  updatedAt: text("updated_at").notNull(),
});

// 5. Official Student Marks & Result Ledger
export const examMarks = sqliteTable("exam_marks", {
  id: text("id").primaryKey(),
  studentRoll: text("student_roll").notNull(),
  studentId: text("student_id"),
  subjectCode: text("subject_code").notNull(),
  subjectId: text("subject_id"),
  examScheduleId: text("exam_schedule_id"),
  internalMarks: integer("internal_marks").default(0),
  externalMarks: integer("external_marks").default(0),
  totalMarks: integer("total_marks").default(0),
  marks: integer("marks").default(0),
  grade: text("grade").default("F"),
  isDeclared: integer("is_declared", { mode: "boolean" }).default(false),
  enteredBy: text("entered_by"),
  updatedAt: text("updated_at"),
});

// 6. UMC (Unfair Means Case) Incident Registry
export const umcIncidents = sqliteTable("umc_incidents", {
  id: text("id").primaryKey(),
  ticketNo: text("ticket_no").notNull().unique(),
  studentId: text("student_id").notNull(),
  rollNo: text("roll_no").notNull(),
  studentName: text("student_name").notNull(),
  subjectCode: text("subject_code").notNull(),
  subjectName: text("subject_name").notNull(),
  examHall: text("exam_hall").notNull(),
  deskNo: text("desk_no").notNull(),
  reportedBy: text("reported_by").notNull(),
  incidentType: text("incident_type").notNull(),
  description: text("description").notNull(),
  evidenceToken: text("evidence_token").notNull(),
  hearingDate: text("hearing_date").notNull(),
  penaltyStatus: text("penalty_status").notNull().default("UNDER_INQUIRY"),
  reportedAt: text("reported_at").notNull(),
});

// 7. Time-Locked Encrypted Paper Vault
export const paper_Vault = sqliteTable("paper_vault", {
  id: text("id").primaryKey(),
  subjectCode: text("subject_code").notNull(),
  subjectName: text("subject_name").notNull(),
  assignedFaculty: text("assigned_faculty").notNull(),
  examDate: text("exam_date").notNull(),
  examTime: text("exam_time").notNull(),
  sha256Seal: text("sha256_seal").notNull(),
  vaultPassword: text("vault_password").notNull().default("8921"),
  isUnlocked: integer("is_unlocked", { mode: "boolean" }).notNull().default(false),
  unlockedBy: text("unlocked_by"),
  unlockedAt: text("unlocked_at"),
});

// 8. Re-evaluation & Re-exam Grievance Payments
export const reEvaluationTickets = sqliteTable("re_evaluation_tickets", {
  id: text("id").primaryKey(),
  ticketNo: text("ticket_no").notNull().unique(),
  type: text("type").notNull(), // "rechecking" | "re_examination"
  studentId: text("student_id").notNull(),
  rollNo: text("roll_no").notNull(),
  studentName: text("student_name").notNull(),
  subjectCode: text("subject_code").notNull(),
  subjectName: text("subject_name").notNull(),
  originalMarks: integer("original_marks").notNull(),
  originalGrade: text("original_grade").notNull(),
  currentSgpa: text("current_sgpa").notNull(),
  location: text("location").notNull(),
  reason: text("reason").notNull(),
  amount: integer("amount").notNull(),
  transactionId: text("transaction_id").notNull(),
  status: text("status").notNull().default("PENDING_FEE_VERIFICATION"),
  verifiedBy: text("verified_by"),
  verifiedAt: text("verified_at"),
  appliedDate: text("applied_date").notNull(),
});

// 9. Issued Optical QR Tokens
export const issuedQrPasses = sqliteTable("issued_qr_passes", {
  id: text("id").primaryKey(),
  passToken: text("pass_token").notNull().unique(),
  studentId: text("student_id").notNull(),
  rollNo: text("roll_no").notNull(),
  studentName: text("student_name").notNull(),
  department: text("department").notNull(),
  examHall: text("exam_hall").notNull().default("Hall B-201"),
  deskNumber: text("desk_number").notNull().default("Desk #04"),
  sessionName: text("session_name").notNull().default("May - 2026 Regular"),
  sha256Seal: text("sha256_seal").notNull(),
  status: text("status").notNull().default("VALID"),
  entryMarkedAt: text("entry_marked_at"),
  verifiedBy: text("verified_by"),
  createdAt: text("created_at").notNull(),
});

// 10. Audit Logs
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  actionType: text("action_type").notNull(),
  performedBy: text("performed_by").notNull(),
  role: text("role").notNull(),
  targetEntity: text("target_entity").notNull(),
  details: text("details").notNull(),
  timestamp: text("timestamp").notNull(),
});

//11. Fee Petitions
export const feePetitions = sqliteTable("fee_petitions", {
  id: text("id").primaryKey(),
  studentRoll: text("student_roll").notNull(),
  subjectCode: text("subject_code").notNull(),
  amount: integer("amount").notNull(),
  transactionId: text("transaction_id").notNull(),
  status: text("status").default("PENDING_FEE_VERIFICATION"),
});

//12. Paper Vault (Time-Locked Encrypted Exam Papers)
export const paperVault = sqliteTable("paper_vault", {
  id: text("id").primaryKey(),
  subjectCode: text("subject_code").notNull(),
  subjectName: text("subject_name").notNull(),
  examDate: text("exam_date").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  paperHash: text("paper_hash").notNull(), // Confidential AES/SHA-256 Hash
  status: text("status").default("LOCKED"), // "LOCKED" | "DECRYPTED_FOR_PRINT"
  createdAt: text("created_at").notNull(),
});

//13. Hall Ticket Generation Requests
export const hallTickets = sqliteTable("hall_tickets", {
  id: text("id").primaryKey(),
  studentRoll: text("student_roll").notNull(),
  studentName: text("student_name").notNull(),
  examCenter: text("exam_center").notNull(),
  session: text("session").notNull(),
  status: text("status").default("RELEASED"), // "RELEASED" | "HELD_BY_ACCOUNTANT" | "CANCELLED"
  approvedBy: text("approved_by").notNull(),
});

//14. Marksheet Ledger (Official Student Marks & Result)
export const marksheets = sqliteTable("marksheets", {
  id: text("id").primaryKey(),
  studentRoll: text("student_roll").notNull(),
  studentName: text("student_name").notNull(),
  subjectCode: text("subject_code").notNull(),
  subjectName: text("subject_name").notNull(),
  internalMarks: integer("internal_marks").notNull(),
  externalMarks: integer("external_marks").notNull(),
  graceMarks: integer("grace_marks").default(0),
  totalMarks: integer("total_marks").notNull(),
  grade: text("grade").notNull(),
  status: text("status").default("DRAFT"), // "DRAFT" | "PUBLISHED"
});

// 15. examSubjects
export const examSubjects = sqliteTable("exam_subjects", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  credits: integer("credits").notNull(),
});

// 16. examEnrollments
export const examEnrollments = sqliteTable("exam_enrollments", {
  id: text("id").primaryKey(),
  studentRoll: text("student_roll").notNull(),
  studentId: text("student_id"),
  subjectCode: text("subject_code").notNull(),
  examScheduleId: text("exam_schedule_id"),
  status: text("status").default("ENROLLED"),
});

// 17. examRecheckingRequests
export const examRecheckingRequests = sqliteTable("exam_rechecking_requests", {
  id: text("id").primaryKey(),
  studentRoll: text("student_roll").notNull(),
  subjectCode: text("subject_code").notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("PENDING"),
});