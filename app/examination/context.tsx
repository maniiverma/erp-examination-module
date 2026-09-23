"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "teacher" | "admin";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  rollNo?: string;
  department?: string;
}

export interface ExamSchedule {
  id: string;
  program: string;
  faculty: string;
  department: string;
  session: string;
  courseYear: string;
  semester: string;
  examType: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  hallticketStatus: string;
  approverStatus: string;
  examCentre: string;
  status: "Open" | "Upcoming" | "Expired";
  isEnrolled: boolean;
}

export interface MarkRecord {
  studentId: string;
  studentName: string;
  rollNo: string;
  subjectCode: string;
  subjectName: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  credits: number;
  isDeclared: boolean;
}

export interface RecheckingTicket {
  id: string;
  subjectCode: string;
  subjectName: string;
  appliedDate: string;
  status: "Pending Review" | "Under COE Verification" | "Marks Revised" | "Rejected";
  reason: string;
  feePaid: string;
}

export interface MalpracticeLog {
  id: string;
  studentRoll: string;
  studentName: string;
  subjectCode: string;
  reason: string;
  reportedBy: string;
  timestamp: string;
}

export interface ExamContextType {
  role: UserRole;
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, pass: string, selectedRole: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  schedules: ExamSchedule[];
  enrollInExam: (id: string) => void;
  addSchedule: (schedule: Omit<ExamSchedule, "id" | "isEnrolled">) => void;
  marksList: MarkRecord[];
  updateMark: (studentId: string, subjectCode: string, field: "internalMarks" | "externalMarks", val: number) => void;
  toggleDeclareResults: (subjectCode?: string) => void;
  tickets: RecheckingTicket[];
  addRecheckTicket: (subjectCode: string, reason: string) => string;
  resolveTicket: (id: string, decision: "Marks Revised" | "Rejected") => void;
  attendanceList: { roll: string; name: string; desk: string; status: "PRESENT" | "ABSENT" }[];
  toggleAttendance: (roll: string) => void;
  malpracticeLogs: MalpracticeLog[];
  addMalpracticeLog: (studentRoll: string, subjectCode: string, reason: string) => void;
}

const userProfiles: Record<UserRole, UserProfile> = {
  student: {
    name: "Manpreet Singh",
    email: "student@ltsu.ac.in",
    role: "student",
    rollNo: "24100030033",
    department: "B.Tech CSE (Cyber Security)",
  },
  teacher: {
    name: "Dr. H.S. Bains",
    email: "teacher@ltsu.ac.in",
    role: "teacher",
    department: "School of Engineering & Technology",
  },
  admin: {
    name: "Controller of Examinations",
    email: "admin@ltsu.ac.in",
    role: "admin",
    department: "Central Examination Branch",
  },
};

const validPasswords: Record<UserRole, string> = {
  student: "student123",
  teacher: "teacher123",
  admin: "admin123",
};

const ExaminationContext = createContext<ExamContextType | undefined>(undefined);

export function ExaminationProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("student");
  const [user, setUser] = useState<UserProfile>(userProfiles.student);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Sync state with localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedAuth = localStorage.getItem("ltsu_auth_status");
    const savedRole = localStorage.getItem("ltsu_exam_role") as UserRole;
    if (savedAuth === "true" && savedRole && userProfiles[savedRole]) {
      setIsAuthenticated(true);
      setRoleState(savedRole);
      setUser(userProfiles[savedRole]);
    }
  }, []);

  const login = (email: string, pass: string, selectedRole: UserRole) => {
    if (pass === validPasswords[selectedRole]) {
      setIsAuthenticated(true);
      setRoleState(selectedRole);
      setUser({ ...userProfiles[selectedRole], email });
      if (typeof window !== "undefined") {
        localStorage.setItem("ltsu_auth_status", "true");
        localStorage.setItem("ltsu_exam_role", selectedRole);
      }
      return { success: true };
    }
    return { success: false, error: "Invalid password for selected role!" };
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ltsu_auth_status");
    }
  };

  // 1. Schedules
  const [schedules, setSchedules] = useState<ExamSchedule[]>([
    {
      id: "exam-101",
      program: "UG",
      faculty: "University School of Engineering and Technology",
      department: "B.Tech. CSE (Cyber Security)",
      session: "Dec - 2025",
      courseYear: "3rd Year",
      semester: "5th Semester",
      examType: "Regular Examination",
      enrollmentStart: "17/3/2026, 5:30:00 am",
      enrollmentEnd: "31/3/2026, 5:30:00 am",
      hallticketStatus: "Hallticket not scheduled",
      approverStatus: "Pending from Accountant",
      examCentre: "LTSU",
      status: "Expired",
      isEnrolled: false,
    },
    {
      id: "exam-102",
      program: "UG",
      faculty: "University School of Engineering and Technology",
      department: "B.Tech. CSE (Cyber Security)",
      session: "May - 2026",
      courseYear: "3rd Year",
      semester: "6th Semester",
      examType: "Regular Examination",
      enrollmentStart: "01/05/2026, 9:00:00 am",
      enrollmentEnd: "20/05/2026, 5:00:00 pm",
      hallticketStatus: "Admit Card Released",
      approverStatus: "Approved by COE",
      examCentre: "LTSU Block-B",
      status: "Open",
      isEnrolled: true,
    },
  ]);

  // 2. Marks List
  const [marksList, setMarksList] = useState<MarkRecord[]>([
    { studentId: "st-1", studentName: "Manpreet Singh", rollNo: "24100030033", subjectCode: "CSE-501", subjectName: "Advanced Cryptography & PKI", internalMarks: 46, externalMarks: 47, totalMarks: 93, grade: "A+", credits: 4, isDeclared: true },
    { studentId: "st-1", studentName: "Manpreet Singh", rollNo: "24100030033", subjectCode: "CSE-502", subjectName: "Ethical Hacking & Penetration Testing", internalMarks: 44, externalMarks: 45, totalMarks: 89, grade: "A", credits: 4, isDeclared: true },
    { studentId: "st-1", studentName: "Manpreet Singh", rollNo: "24100030033", subjectCode: "CSE-503", subjectName: "Cloud Security & Zero-Trust Architecture", internalMarks: 42, externalMarks: 43, totalMarks: 85, grade: "A", credits: 3, isDeclared: true },
    { studentId: "st-1", studentName: "Manpreet Singh", rollNo: "24100030033", subjectCode: "CSE-504", subjectName: "Cyber Forensics & Incident Response", internalMarks: 48, externalMarks: 49, totalMarks: 97, grade: "O", credits: 3, isDeclared: true },
    { studentId: "st-2", studentName: "Amanjot Kaur", rollNo: "24100030018", subjectCode: "CSE-502", subjectName: "Ethical Hacking & Penetration Testing", internalMarks: 40, externalMarks: 42, totalMarks: 82, grade: "A", credits: 4, isDeclared: true },
    { studentId: "st-3", studentName: "Rohit Verma", rollNo: "24100030089", subjectCode: "CSE-502", subjectName: "Ethical Hacking & Penetration Testing", internalMarks: 32, externalMarks: 34, totalMarks: 66, grade: "B+", credits: 4, isDeclared: false },
  ]);

  // 3. Tickets
  const [tickets, setTickets] = useState<RecheckingTicket[]>([
    {
      id: "REV-8921",
      subjectCode: "CSE-502",
      subjectName: "Ethical Hacking & Penetration Testing",
      appliedDate: "28/08/2026",
      status: "Under COE Verification",
      reason: "Question 4 (Buffer Overflow scenario) total sum discrepancy.",
      feePaid: "₹500 (Auto-Deducted)"
    }
  ]);

  // 4. Attendance
  const [attendanceList, setAttendanceList] = useState([
    { roll: "24100030033", name: "Manpreet Singh", desk: "Desk #14", status: "PRESENT" as const },
    { roll: "24100030018", name: "Amanjot Kaur", desk: "Desk #15", status: "PRESENT" as const },
    { roll: "24100030089", name: "Rohit Verma", desk: "Desk #16", status: "ABSENT" as const },
  ]);

  // 5. Malpractice Logs
  const [malpracticeLogs, setMalpracticeLogs] = useState<MalpracticeLog[]>([
    {
      id: "UMP-101",
      studentRoll: "24100030089",
      studentName: "Rohit Verma",
      subjectCode: "CSE-502",
      reason: "Unapproved smart watch and reference notes found during desk audit.",
      reportedBy: "Dr. H.S. Bains",
      timestamp: "2026-05-18 10:45 AM",
    },
  ]);

  const enrollInExam = (id: string) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, isEnrolled: true, approverStatus: "Enrolled & Approved" } : s))
    );
  };

  const addSchedule = (schedule: Omit<ExamSchedule, "id" | "isEnrolled">) => {
    const newSch: ExamSchedule = {
      ...schedule,
      id: `exam-${Date.now()}`,
      isEnrolled: false,
    };
    setSchedules(prev => [newSch, ...prev]);
  };

  const updateMark = (studentId: string, subjectCode: string, field: "internalMarks" | "externalMarks", val: number) => {
    setMarksList(prev =>
      prev.map(m => {
        if (m.studentId === studentId && m.subjectCode === subjectCode) {
          const updatedVal = isNaN(val) ? 0 : Math.min(50, Math.max(0, val));
          const newInternal = field === "internalMarks" ? updatedVal : m.internalMarks;
          const newExternal = field === "externalMarks" ? updatedVal : m.externalMarks;
          const total = newInternal + newExternal;
          const grade = total >= 90 ? "O" : total >= 80 ? "A+" : total >= 70 ? "A" : total >= 60 ? "B+" : total >= 50 ? "B" : "F";
          return { ...m, [field]: updatedVal, totalMarks: total, grade };
        }
        return m;
      })
    );
  };

  const toggleDeclareResults = (subjectCode?: string) => {
    setMarksList(prev =>
      prev.map(m => (!subjectCode || m.subjectCode === subjectCode ? { ...m, isDeclared: true } : m))
    );
  };

  const addRecheckTicket = (subjectCode: string, reason: string) => {
    const ticketId = `REV-${Math.floor(1000 + Math.random() * 9000)}`;
    const subName = marksList.find(m => m.subjectCode === subjectCode)?.subjectName || "Subject Evaluation";
    const newTicket: RecheckingTicket = {
      id: ticketId,
      subjectCode,
      subjectName: subName,
      appliedDate: "31/08/2026",
      status: "Pending Review",
      reason,
      feePaid: "₹500 (Fee Wallet Deducted)",
    };
    setTickets(prev => [newTicket, ...prev]);
    return ticketId;
  };

  const resolveTicket = (id: string, decision: "Marks Revised" | "Rejected") => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, status: decision } : t))
    );
  };

  const toggleAttendance = (roll: string) => {
    setAttendanceList(prev =>
      prev.map(a => (a.roll === roll ? { ...a, status: a.status === "PRESENT" ? "ABSENT" : "PRESENT" } : a))
    );
  };

  const addMalpracticeLog = (studentRoll: string, subjectCode: string, reason: string) => {
    const newLog: MalpracticeLog = {
      id: `UMP-${Math.floor(100 + Math.random() * 900)}`,
      studentRoll,
      studentName: attendanceList.find((a) => a.roll === studentRoll)?.name || "Candidate",
      subjectCode,
      reason,
      reportedBy: user.name || "Invigilator Desk",
      timestamp: new Date().toLocaleString(),
    };
    setMalpracticeLogs((prev) => [newLog, ...prev]);
  };

  return (
    <ExaminationContext.Provider
      value={{
        role,
        user,
        isAuthenticated,
        login,
        logout,
        schedules,
        enrollInExam,
        addSchedule,
        marksList,
        updateMark,
        toggleDeclareResults,
        tickets,
        addRecheckTicket,
        resolveTicket,
        attendanceList,
        toggleAttendance,
        malpracticeLogs,
        addMalpracticeLog,
      }}
    >
      {children}
    </ExaminationContext.Provider>
  );
}

// SAFE HOOK WITH DEFAULT FALLBACK (Prevents 500 Uncaught Context Crash)
export function useExamRBAC(): ExamContextType {
  const ctx = useContext(ExaminationContext);
  if (!ctx) {
    return {
      role: "student",
      user: {
        name: "Manpreet Singh",
        email: "student@ltsu.ac.in",
        role: "student",
        rollNo: "24100030033",
        department: "B.Tech CSE (Cyber Security)",
      },
      isAuthenticated: true,
      login: () => ({ success: true }),
      logout: () => {},
      schedules: [],
      enrollInExam: () => {},
      addSchedule: () => {},
      marksList: [],
      updateMark: () => {},
      toggleDeclareResults: () => {},
      tickets: [],
      addRecheckTicket: () => `REV-${Math.floor(1000 + Math.random() * 9000)}`,
      resolveTicket: () => {},
      attendanceList: [],
      toggleAttendance: () => {},
      malpracticeLogs: [],
      addMalpracticeLog: () => {},
    };
  }
  return ctx;
}