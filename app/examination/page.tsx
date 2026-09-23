"use client";

import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import { 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Lock, 
  Unlock, 
  LogOut, 
  Mail, 
  Camera, 
  CameraOff, 
  AlertCircle, 
  PlusCircle, 
  Check, 
  X, 
  Trash2, 
  Edit, 
  Search, 
  AlertTriangle, 
  Loader2, 
  Grid3X3, 
  KeyRound, 
  History, 
  FileText, 
  ScanLine, 
  UserCheck, 
  Building, 
  Printer, 
  Shuffle, 
  FileSpreadsheet, 
  AlertOctagon, 
  ShieldAlert, 
  Banknote, 
  Download, 
  Calendar, 
  Layers, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Eye, 
  FileDown, 
  CreditCard, 
  Receipt, 
  Copy, 
  BadgeAlert, 
  FileCheck, 
  HelpCircle, 
  RefreshCcw,
  Upload,
  HardDrive,
  Users,
  Activity,
  Radio,
  UserX,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Ban,
  UserCog,
  GraduationCap,
  BookOpen,
  DollarSign,
  Briefcase,
  Book,
  Home,
  Bus,
  FlaskConical,
  MessageSquare
} from "lucide-react";

type UserRole = "student" | "teacher" | "admin";

// =========================================================================
// ADVANCED RBAC PERMISSION MATRIX CONFIGURATION
// =========================================================================
const ALLOWED_MODULES: Record<UserRole, string[]> = {
  admin: [
    "admission", "academic", "examination", "finance", "hr", 
    "student_sys", "library", "hostel", "transport", "placement", 
    "research", "communication", "stock"
  ],
  teacher: [
    "academic", "examination", "student_sys", "library", "research", "communication"
  ],
  student: [
    "academic", "examination", "finance", "student_sys", "library", "hostel", "transport", "communication"
  ]
};

const ALLOWED_EXAM_TABS: Record<UserRole, string[]> = {
  admin: [
    "sessions", "admin_admit_cards", "admin_classes", "admin_payments", 
    "qr_scanner", "results_hub", "paper_vault", "admin_approvals"
  ],
  teacher: [
    "sessions", "teacher_admit_approval", "faculty_invigilation", 
    "qr_scanner", "results_hub", "umc_region", "paper_vault"
  ],
  student: [
    "admit_card", "student_datesheet", "student_marksheet", "rechecking", "sessions"
  ]
};

interface SeatingDesk {
  id: string;
  hallNumber: string;
  deskNumber: string;
  rowNumber: number;
  colNumber: number;
  studentName: string;
  rollNo: string;
  subjectCode: string;
  dummyRollNo: string;
  status: "ASSIGNED" | "VACANT" | "BLOCKED_UMC";
  attendanceStatus: "PRESENT" | "ABSENT" | "PENDING";
  invigilatorNotes?: string;
}

interface ClassroomMeta {
  hallNumber: string;
  block: string;
  floor: string;
  assignedFaculty: string;
  facultyPhone: string;
  roomType: "Theory Hall" | "Cyber Warfare Lab" | "Tiered Auditorium";
  totalDesks: number;
  cctvStreamStatus: "ACTIVE_RECORDING" | "STANDBY";
  lastAuditRound: string;
}

interface EnrolledStudent {
  rollNo: string;
  studentName: string;
  program: string;
  department: string;
  enrolledDate: string;
}

interface ExamScheduleItem {
  id: string;
  program: string;
  department: string;
  session: string;
  semester: string;
  examCentre: string;
  status: "Open" | "Closed" | "Pending Approval";
  isEnrolled: boolean;
  enrolledStudents: EnrolledStudent[];
}

interface GrievancePaymentTicket {
  id: string;
  ticketNo: string;
  type: "rechecking" | "re_examination";
  studentName: string;
  rollNo: string;
  subjectCode: string;
  subjectName: string;
  originalMarks: number;
  originalGrade: string;
  currentSgpa: string;
  location: string;
  reason: string;
  amount: number;
  transactionId: string;
  status: "PENDING_FEE_VERIFICATION" | "FEE_CLEARED_APPROVED" | "DOUBT_FLAGGED" | "REJECTED";
  discrepancyNote?: string;
  appliedDate: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

interface AdmitCardRecord {
  id: string;
  rollNo: string;
  studentName: string;
  program: string;
  department: string;
  semester: string;
  examCentre: string;
  hallNumber: string;
  deskNumber: string;
  passToken: string;
  status: "APPROVED" | "PENDING" | "DISAPPROVED";
  issuedBy: string;
  issuedDate: string;
  approvedByTeacher?: string;
  approvedAt?: string;
}

interface VaultPaperRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  assignedFaculty: string;
  examDate: string;
  examTime: string;
  sha256Seal: string;
  vaultPassword: string;
  isUnlocked: boolean;
  fileName?: string;
}

export default function ComprehensiveExamSuite() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Core Module State
  const [activeModule, setActiveModule] = useState<string>("examination");

  // Auth States
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<string>("sessions");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Register Form
  const [regRole, setRegRole] = useState<UserRole>("student");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRollNo, setRegRollNo] = useState("24100030033");
  const [regEmpId, setRegEmpId] = useState("EMP-8921");
  const [regAssignedSubject, setRegAssignedSubject] = useState("CSE-501 (Advanced Cryptography & PKI)");
  const [regDept, setRegDept] = useState("B.Tech. CSE (Cyber Security)");

  // 1. Date Sheet & Student Subjects
  const [dateSheet, setDateSheet] = useState([
    { id: "ds-1", subjectCode: "CSE-501", subjectName: "Advanced Cryptography & PKI", examDate: "18/12/2026", examTime: "09:30 AM - 12:30 PM", hall: "Hall B-201", desk: "Desk #04", centre: "LTSU Main Block-B" },
    { id: "ds-2", subjectCode: "CSE-502", subjectName: "Ethical Hacking & Penetration Testing", examDate: "21/12/2026", examTime: "09:30 AM - 12:30 PM", hall: "Hall B-201", desk: "Desk #04", centre: "LTSU Main Block-B" },
    { id: "ds-3", subjectCode: "CSE-503", subjectName: "Cloud Security & Zero-Trust Architecture", examDate: "24/12/2026", examTime: "09:30 AM - 12:30 PM", hall: "Hall B-201", desk: "Desk #04", centre: "LTSU Main Block-B" },
    { id: "ds-4", subjectCode: "CSE-504", subjectName: "Cyber Forensics & Incident Response", examDate: "28/12/2026", examTime: "09:30 AM - 12:30 PM", hall: "Hall B-201", desk: "Desk #04", centre: "LTSU Main Block-B" }
  ]);

  // 2. Exam Schedules Master
  const [schedules, setSchedules] = useState<ExamScheduleItem[]>([
    {
      id: "exam-101",
      program: "UG",
      department: "B.Tech. CSE (Cyber Security)",
      session: "Dec - 2025",
      semester: "5th Semester",
      examCentre: "LTSU Main Block-B",
      status: "Open",
      isEnrolled: true,
      enrolledStudents: [
        { rollNo: "24100030033", studentName: "Manpreet Singh", program: "UG (B.Tech)", department: "B.Tech. CSE (Cyber Security)", enrolledDate: "01/09/2026" },
        { rollNo: "24100030001", studentName: "Aarav Sharma", program: "UG (B.Tech)", department: "B.Tech. CSE (Cyber Security)", enrolledDate: "01/09/2026" },
        { rollNo: "24100030007", studentName: "Bhavna Patel", program: "UG (B.Tech)", department: "B.Tech. CSE (Cyber Security)", enrolledDate: "01/09/2026" },
      ]
    },
    {
      id: "exam-102",
      program: "UG",
      department: "B.Tech. CSE (AI & Data Science)",
      session: "May - 2026",
      semester: "6th Semester",
      examCentre: "LTSU Block-A",
      status: "Open",
      isEnrolled: false,
      enrolledStudents: [
        { rollNo: "24100030095", studentName: "Simran Kaur", program: "UG (B.Tech)", department: "B.Tech. CSE (AI & Data Science)", enrolledDate: "01/09/2026" },
      ]
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [viewingEnrolledSchedule, setViewingEnrolledSchedule] = useState<ExamScheduleItem | null>(null);
  const [newDepartment, setNewDepartment] = useState("B.Tech. CSE (Cyber Security)");
  const [newSession, setNewSession] = useState("Dec - 2026");
  const [newSemester, setNewSemester] = useState("5th Semester");
  const [newExamCentre, setNewExamCentre] = useState("LTSU Main Block-B");

  // 3. Central Admit Card Repository
  const [admitCards, setAdmitCards] = useState<AdmitCardRecord[]>([
    {
      id: "ac-1",
      rollNo: "24100030033",
      studentName: "Manpreet Singh",
      program: "UG (B.Tech)",
      department: "B.Tech. CSE (Cyber Security)",
      semester: "5th Semester",
      examCentre: "LTSU Main Block-B, Punjab Campus",
      hallNumber: "Hall B-201",
      deskNumber: "Desk #04",
      passToken: "LTSU-PASS-24100030033-9A82",
      status: "APPROVED",
      issuedBy: "COE Central Branch",
      issuedDate: "01/09/2026",
      approvedByTeacher: "Dr. H.S. Bains (CSE Incharge)",
      approvedAt: "01/09/2026, 09:30 AM"
    },
    {
      id: "ac-2",
      rollNo: "24100030001",
      studentName: "Aarav Sharma",
      program: "UG (B.Tech)",
      department: "B.Tech. CSE (Cyber Security)",
      semester: "5th Semester",
      examCentre: "LTSU Main Block-B, Punjab Campus",
      hallNumber: "Hall B-201",
      deskNumber: "Desk #01",
      passToken: "LTSU-PASS-24100030001-F381",
      status: "APPROVED",
      issuedBy: "COE Central Branch",
      issuedDate: "01/09/2026",
      approvedByTeacher: "Dr. H.S. Bains (CSE Incharge)",
      approvedAt: "01/09/2026, 09:45 AM"
    },
    {
      id: "ac-3",
      rollNo: "24100030089",
      studentName: "Rohit Verma",
      program: "UG (B.Tech)",
      department: "B.Tech. CSE (Cyber Security)",
      semester: "5th Semester",
      examCentre: "LTSU Main Block-B, Punjab Campus",
      hallNumber: "Hall B-201",
      deskNumber: "Desk #05",
      passToken: "LTSU-PASS-24100030089-D990",
      status: "DISAPPROVED",
      issuedBy: "Accounts Branch (Fee Dues Pending)",
      issuedDate: "01/09/2026",
      approvedByTeacher: "Pending Inspection",
    },
    {
      id: "ac-4",
      rollNo: "24100030095",
      studentName: "Simran Kaur",
      program: "UG (B.Tech)",
      department: "B.Tech. CSE (AI & Data Science)",
      semester: "6th Semester",
      examCentre: "LTSU Block-A",
      hallNumber: "Hall A-102",
      deskNumber: "Desk #02",
      passToken: "LTSU-PASS-24100030095-E221",
      status: "PENDING",
      issuedBy: "COE Central Branch",
      issuedDate: "01/09/2026",
      approvedByTeacher: "Pending Incharge Review",
    }
  ]);

  const [bulkAdmitCsvText, setBulkAdmitCsvText] = useState(
    "24100030018,Amanjot Kaur,B.Tech CSE,5th Sem,Hall B-201,Desk #03\n24100030007,Bhavna Patel,B.Tech CSE,5th Sem,Hall B-201,Desk #02"
  );
  const [admitSearchQuery, setAdmitSearchQuery] = useState("");

  // 4. Seating Matrix & Classrooms
  const [classroomsMeta, setClassroomsMeta] = useState<ClassroomMeta[]>([
    {
      hallNumber: "Hall B-201",
      block: "Block-B (CSE Wing)",
      floor: "2nd Floor",
      assignedFaculty: "Dr. H.S. Bains (Invigilator Lead)",
      facultyPhone: "+91 98721-XXXXX",
      roomType: "Theory Hall",
      totalDesks: 8,
      cctvStreamStatus: "ACTIVE_RECORDING",
      lastAuditRound: "Round 2 · 10:15 AM"
    },
    {
      hallNumber: "Hall A-102",
      block: "Block-A (Main Academic)",
      floor: "1st Floor",
      assignedFaculty: "Dr. K.S. Verma (Invigilator)",
      facultyPhone: "+91 98140-XXXXX",
      roomType: "Tiered Auditorium",
      totalDesks: 6,
      cctvStreamStatus: "ACTIVE_RECORDING",
      lastAuditRound: "Round 1 · 09:45 AM"
    },
    {
      hallNumber: "Cyber Warfare Lab 3",
      block: "Block-B (Security Wing)",
      floor: "3rd Floor",
      assignedFaculty: "Prof. Ravneet Kaur (Lab Supt.)",
      facultyPhone: "+91 97800-XXXXX",
      roomType: "Cyber Warfare Lab",
      totalDesks: 6,
      cctvStreamStatus: "ACTIVE_RECORDING",
      lastAuditRound: "Round 2 · 10:20 AM"
    }
  ]);

  const [selectedHall, setSelectedHall] = useState<string>("Hall B-201");
  const [seatingList, setSeatingList] = useState<SeatingDesk[]>([
    { id: "seat-1", hallNumber: "Hall B-201", deskNumber: "Desk #01", rowNumber: 1, colNumber: 1, studentName: "Aarav Sharma", rollNo: "24100030001", subjectCode: "CSE-502", dummyRollNo: "DUMMY-9021", status: "ASSIGNED", attendanceStatus: "PRESENT" },
    { id: "seat-2", hallNumber: "Hall B-201", deskNumber: "Desk #02", rowNumber: 1, colNumber: 2, studentName: "Bhavna Patel", rollNo: "24100030007", subjectCode: "CSE-502", dummyRollNo: "DUMMY-9022", status: "ASSIGNED", attendanceStatus: "PRESENT" },
    { id: "seat-3", hallNumber: "Hall B-201", deskNumber: "Desk #03", rowNumber: 1, colNumber: 3, studentName: "Amanjot Kaur", rollNo: "24100030018", subjectCode: "CSE-502", dummyRollNo: "DUMMY-9023", status: "ASSIGNED", attendanceStatus: "PENDING" },
    { id: "seat-4", hallNumber: "Hall B-201", deskNumber: "Desk #04", rowNumber: 1, colNumber: 4, studentName: "Manpreet Singh", rollNo: "24100030033", subjectCode: "CSE-502", dummyRollNo: "DUMMY-9024", status: "ASSIGNED", attendanceStatus: "PRESENT" },
    { id: "seat-5", hallNumber: "Hall B-201", deskNumber: "Desk #05", rowNumber: 2, colNumber: 1, studentName: "Rohit Verma", rollNo: "24100030089", subjectCode: "CSE-502", dummyRollNo: "DUMMY-9025", status: "BLOCKED_UMC", attendanceStatus: "ABSENT" },
    { id: "seat-6", hallNumber: "Hall B-201", deskNumber: "Desk #06", rowNumber: 2, colNumber: 2, studentName: "Simran Kaur", rollNo: "24100030095", subjectCode: "CSE-502", dummyRollNo: "DUMMY-9026", status: "ASSIGNED", attendanceStatus: "PRESENT" },
    { id: "seat-7", hallNumber: "Hall B-201", deskNumber: "Desk #07", rowNumber: 2, colNumber: 3, studentName: "Tanveer Singh", rollNo: "24100030102", subjectCode: "CSE-502", dummyRollNo: "DUMMY-9027", status: "VACANT", attendanceStatus: "PENDING" },
    { id: "seat-8", hallNumber: "Hall B-201", deskNumber: "Desk #08", rowNumber: 2, colNumber: 4, studentName: "Vikas Kumar", rollNo: "24100030110", subjectCode: "CSE-502", dummyRollNo: "DUMMY-9028", status: "ASSIGNED", attendanceStatus: "PRESENT" },
  ]);

  const [selectedClassCard, setSelectedClassCard] = useState<string | null>(null);
  const [classFilterStatus, setClassFilterStatus] = useState<string>("ALL");
  const [classSearchQuery, setClassSearchQuery] = useState<string>("");
  const [isSeatingUploadModalOpen, setIsSeatingUploadModalOpen] = useState(false);
  const [seatingUploadTargetHall, setSeatingUploadTargetHall] = useState("Hall B-201");
  const [seatingUploadCsvText, setSeatingUploadCsvText] = useState(
    "Desk #01,Aarav Sharma,24100030001,CSE-502\nDesk #02,Bhavna Patel,24100030007,CSE-502\nDesk #03,Amanjot Kaur,24100030018,CSE-502\nDesk #04,Manpreet Singh,24100030033,CSE-502"
  );

  // 5. Marks List & Bulk Ingestion
  const [marksList, setMarksList] = useState<any[]>([
    { id: "m-1", studentId: "std-4", rollNo: "24100030033", subjectCode: "CSE-501", subjectName: "Advanced Cryptography & PKI", internalMarks: 46, externalMarks: 48, totalMarks: 94, grade: "O", credits: 4, evaluatedBy: "Dr. H.S. Bains" },
    { id: "m-2", studentId: "std-4", rollNo: "24100030033", subjectCode: "CSE-502", subjectName: "Ethical Hacking & Penetration Testing", internalMarks: 44, externalMarks: 45, totalMarks: 89, grade: "A+", credits: 4, evaluatedBy: "Dr. H.S. Bains" },
    { id: "m-3", studentId: "std-4", rollNo: "24100030033", subjectCode: "CSE-503", subjectName: "Cloud Security & Zero-Trust Architecture", internalMarks: 42, externalMarks: 44, totalMarks: 86, grade: "A", credits: 3, evaluatedBy: "Dr. H.S. Bains" },
    { id: "m-4", studentId: "std-4", rollNo: "24100030033", subjectCode: "CSE-504", subjectName: "Cyber Forensics & Incident Response", internalMarks: 48, externalMarks: 49, totalMarks: 97, grade: "O", credits: 3, evaluatedBy: "Dr. H.S. Bains" },
  ]);
  const [bulkCsvText, setBulkCsvText] = useState("24100030033,CSE-501,Advanced Cryptography & PKI,46,48,4");

  // 6. UMC Malpractice List
  const [umcList, setUmcList] = useState<any[]>([
    {
      id: "umc-1",
      ticketNo: "UMC-2026-089",
      studentName: "Rohit Verma",
      rollNo: "24100030089",
      subjectCode: "CSE-502",
      subjectName: "Ethical Hacking & Penetration Testing",
      examHall: "Hall B-201",
      deskNo: "Desk #05",
      reportedBy: "Dr. K.S. Verma (Flying Squad)",
      incidentType: "Electronic Device/Mobile",
      description: "Smartwatch seized with unauthorized cheat material during exam.",
      hearingDate: "10/09/2026, 11:00 AM (COE Room)",
      penaltyStatus: "UNDER_INQUIRY",
    }
  ]);
  const [isUmcModalOpen, setIsUmcModalOpen] = useState(false);
  const [umcRoll, setUmcRoll] = useState("24100030033");
  const [umcName, setUmcName] = useState("Manpreet Singh");
  const [umcSubCode, setUmcSubCode] = useState("CSE-502");
  const [umcDesk, setUmcDesk] = useState("Desk #04");
  const [umcType, setUmcType] = useState("Electronic Device/Mobile");
  const [umcDesc, setUmcDesc] = useState("");

  // 7. Paper Vault
  const [paperVaultList, setPaperVaultList] = useState<VaultPaperRecord[]>([
    { 
      id: "pv-501", 
      subjectCode: "CSE-501", 
      subjectName: "Advanced Cryptography & PKI", 
      assignedFaculty: "Dr. H.S. Bains", 
      examDate: "18/12/2026",
      examTime: "09:30 AM",
      sha256Seal: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", 
      vaultPassword: "8921", 
      isUnlocked: false,
      fileName: "CSE501_Final_Dec2026_Sealed.pdf"
    },
    { 
      id: "pv-502", 
      subjectCode: "CSE-502", 
      subjectName: "Ethical Hacking & Penetration Testing", 
      assignedFaculty: "Dr. K.S. Verma", 
      examDate: "21/12/2026",
      examTime: "09:30 AM",
      sha256Seal: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4", 
      vaultPassword: "9042", 
      isUnlocked: false,
      fileName: "CSE502_QuestionPaper_Dec2026.pdf"
    },
  ]);

  const [vaultPasswords, setVaultPasswords] = useState<Record<string, string>>({});
  const [isPaperUploadModalOpen, setIsPaperUploadModalOpen] = useState(false);
  const [newPaperCode, setNewPaperCode] = useState("CSE-503");
  const [newPaperName, setNewPaperName] = useState("Cloud Security & Zero-Trust Architecture");
  const [newPaperPass, setNewPaperPass] = useState("7721");
  const [newPaperUploadedFileName, setNewPaperUploadedFileName] = useState("");

  // 8. Optical QR Scanner
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [scanManualInput, setScanManualInput] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // 9. Re-evaluation & Payment Gateway State
  const [petitionType, setPetitionType] = useState<"rechecking" | "re_examination">("rechecking");
  const [recheckSubCode, setRecheckSubCode] = useState("CSE-502");
  const [recheckReason, setRecheckReason] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [transactionInput, setTransactionInput] = useState("");

  const [recheckTickets, setRecheckTickets] = useState<GrievancePaymentTicket[]>([
    {
      id: "rev-1",
      ticketNo: "REV-2026-8921",
      type: "rechecking",
      studentName: "Manpreet Singh",
      rollNo: "24100030033",
      subjectCode: "CSE-502",
      subjectName: "Ethical Hacking & Penetration Testing",
      originalMarks: 89,
      originalGrade: "A+",
      currentSgpa: "8.85",
      location: "LTSU Main Block-B (Hall B-201, Punjab)",
      reason: "Discrepancy in Question 4 Buffer Overflow evaluation marks sum.",
      amount: 500,
      transactionId: "UPI/429810298311/PAYTM",
      status: "FEE_CLEARED_APPROVED",
      appliedDate: "01/09/2026",
      verifiedBy: "COE & Administration Board",
      verifiedAt: "01/09/2026, 11:20 AM"
    }
  ]);

  const subjectScoreMap: Record<string, { name: string; marks: number; grade: string; examCentre: string }> = {
    "CSE-501": { name: "Advanced Cryptography & PKI", marks: 94, grade: "O", examCentre: "LTSU Main Block-B (Hall B-201, Punjab)" },
    "CSE-502": { name: "Ethical Hacking & Penetration Testing", marks: 89, grade: "A+", examCentre: "LTSU Main Block-B (Hall B-201, Punjab)" },
    "CSE-503": { name: "Cloud Security & Zero-Trust Architecture", marks: 86, grade: "A", examCentre: "LTSU Main Block-B (Hall B-201, Punjab)" },
    "CSE-504": { name: "Cyber Forensics & Incident Response", marks: 97, grade: "O", examCentre: "LTSU Main Block-B (Hall B-201, Punjab)" },
  };

  // 10. Admin User Approvals State
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  // Safe Context Loader
  const refreshAllContext = async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me").catch(() => null);
      if (meRes && meRes.ok) {
        const meJson = await meRes.json();
        setCurrentUser(meJson.user);
      }
      const pendRes = await fetch("/api/admin/pending-users").catch(() => null);
      if (pendRes && pendRes.ok) {
        const pData = await pendRes.json();
        if (pData.data && pData.data.length > 0) setPendingUsers(pData.data);
      }
    } catch (e) {
      console.warn("API fallback active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllContext();
  }, []);

  // Safe Normalized Roles
  const role: UserRole = (currentUser?.role || "").toLowerCase() as UserRole;
  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";

  // RBAC Guard helper
  const canPerformAction = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(role);
  };

  // Safe Navigation Enforcement Effect
  useEffect(() => {
    if (currentUser) {
      const allowedMods = ALLOWED_MODULES[role] || [];
      if (!allowedMods.includes(activeModule)) {
        setActiveModule(allowedMods[0] || "examination");
      }
      const allowedTabs = ALLOWED_EXAM_TABS[role] || [];
      if (!allowedTabs.includes(activeTab)) {
        setActiveTab(allowedTabs[0] || "sessions");
      }
    }
  }, [currentUser, activeModule, activeTab]);

  // Camera & Verification
  const startCameraScanner = async () => {
    if (!canPerformAction(["teacher", "admin"])) {
      alert("Access Denied: Only Invigilators or Administrators can access optical gate scanners.");
      return;
    }
    try {
      setIsCameraActive(true);
      setScanError("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        requestAnimationFrame(tickScanner);
      }
    } catch (err) {
      setScanError("Camera access denied or unavailable. Enter token manually below.");
      setIsCameraActive(false);
    }
  };

  const stopCameraScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    setIsCameraActive(false);
  };

  const tickScanner = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.height = videoRef.current.videoHeight;
          canvas.width = videoRef.current.videoWidth;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
          if (code && code.data) {
            stopCameraScanner();
            verifyScannedToken(code.data);
            return;
          }
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(tickScanner);
  };

  const verifyScannedToken = (tokenString: string) => {
    setScanLoading(true);
    setScanError("");
    setScannedResult(null);

    const clean = tokenString.trim();
    const matched = admitCards.find(ac => ac.passToken === clean || clean.includes(ac.rollNo));

    setTimeout(() => {
      if (matched) {
        setScannedResult(matched);
      } else {
        setScanError("INVALID OR UNREGISTERED TOKEN! Record not found in LTSU Database.");
      }
      setScanLoading(false);
    }, 400);
  };

  // Classroom Attendance & CSV Import
  const handleToggleStudentAttendance = (deskId: string, current: string) => {
    if (!canPerformAction(["teacher", "admin"])) return;
    const nextStatus = current === "PRESENT" ? "ABSENT" : "PRESENT";
    setSeatingList(prev => prev.map(d => d.id === deskId ? { ...d, attendanceStatus: nextStatus as any } : d));
  };

  const handleShuffleRoomDesks = (hallName: string) => {
    if (!canPerformAction(["admin"])) {
      alert("Access Denied: Only Examination Controller / Admin can trigger anti-cheat desk shuffling.");
      return;
    }
    const roomDesks = seatingList.filter(d => d.hallNumber === hallName && d.status !== "BLOCKED_UMC" && d.status !== "VACANT");
    const shuffled = [...roomDesks].sort(() => Math.random() - 0.5);
    let sIdx = 0;

    setSeatingList(prev => prev.map(d => {
      if (d.hallNumber !== hallName || d.status === "BLOCKED_UMC" || d.status === "VACANT") return d;
      const assigned = shuffled[sIdx++];
      return {
        ...d,
        studentName: assigned.studentName,
        rollNo: assigned.rollNo,
        dummyRollNo: `DUMMY-${Math.floor(1000 + Math.random() * 9000)}`
      };
    }));
    alert(`Anti-Cheat Shuffling applied for ${hallName}! Dummy roll seals updated.`);
  };

  const handleImportSeatingCSV = (hallName: string, fileContent: string) => {
    if (!canPerformAction(["admin"])) {
      alert("Access Denied: Administrative authority required for seating ingestion.");
      return;
    }
    try {
      const lines = fileContent.trim().split("\n");
      const updatedDesks = lines.map((line, idx) => {
        const [deskNo, studentName, rollNo, subjectCode] = line.split(",");
        return {
          id: `seat-imp-${hallName}-${idx}`,
          hallNumber: hallName,
          deskNumber: deskNo?.trim() || `Desk #${idx + 1}`,
          rowNumber: Math.floor(idx / 4) + 1,
          colNumber: (idx % 4) + 1,
          studentName: studentName?.trim() || "Candidate",
          rollNo: rollNo?.trim() || `241000300${idx + 1}`,
          subjectCode: subjectCode?.trim() || "CSE-502",
          dummyRollNo: `DUMMY-${Math.floor(1000 + Math.random() * 9000)}`,
          status: "ASSIGNED" as const,
          attendanceStatus: "PENDING" as const,
        };
      });

      setSeatingList(prev => [
        ...prev.filter(d => d.hallNumber !== hallName),
        ...updatedDesks
      ]);

      setClassroomsMeta(prev => prev.map(c => c.hallNumber === hallName ? { ...c, totalDesks: updatedDesks.length } : c));
      alert(`Successfully imported ${updatedDesks.length} desk arrangements for ${hallName}!`);
    } catch (e) {
      alert("Invalid CSV Format! Use: DeskNo,StudentName,RollNo,SubjectCode");
    }
  };

  const exportClassAttendanceCSV = (hallName: string) => {
    const classStudents = seatingList.filter(d => d.hallNumber === hallName);
    let csvContent = "data:text/csv;charset=utf-8,Desk Number,Row,Col,Student Name,Roll Number,Subject Code,Dummy Mask Seal,Status,Attendance\n";
    classStudents.forEach(row => {
      csvContent += `${row.deskNumber},${row.rowNumber},${row.colNumber},"${row.studentName}",${row.rollNo},${row.subjectCode},${row.dummyRollNo},${row.status},${row.attendanceStatus}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LTSU_${hallName.replace(/\s+/g, '_')}_Official_Register.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk CSV Handlers
  const handleBulkAdmitCardUpload = () => {
    if (!canPerformAction(["admin"])) {
      alert("Access Denied: Only Central COE Admin can perform bulk admit card generation.");
      return;
    }
    try {
      const lines = bulkAdmitCsvText.trim().split("\n");
      const newCards = lines.map((l) => {
        const [roll, name, prog, sem, hall, desk] = l.split(",");
        return {
          id: `ac-${roll.trim()}`,
          rollNo: roll.trim(),
          studentName: name.trim(),
          program: prog?.trim() || "UG (B.Tech)",
          department: "B.Tech. CSE (Cyber Security)",
          semester: sem?.trim() || "5th Semester",
          examCentre: "LTSU Main Block-B, Punjab Campus",
          hallNumber: hall?.trim() || "Hall B-201",
          deskNumber: desk?.trim() || "Desk #04",
          passToken: `LTSU-PASS-${roll.trim()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          status: "APPROVED" as const,
          issuedBy: currentUser?.name || "Class Incharge",
          issuedDate: "01/09/2026",
          approvedByTeacher: `${currentUser?.name} (Class Incharge)`,
          approvedAt: new Date().toLocaleTimeString()
        };
      });
      setAdmitCards([...newCards, ...admitCards]);
      alert(`Issued & Approved ${newCards.length} student Admit Cards!`);
    } catch (e) {
      alert("Invalid CSV Format! Use: Roll,Name,Program,Semester,Hall,Desk");
    }
  };

  const handleBulkResultUpload = () => {
    if (!canPerformAction(["teacher", "admin"])) {
      alert("Access Denied: Evaluator or Admin privileges required to upload grades.");
      return;
    }
    try {
      const lines = bulkCsvText.trim().split("\n");
      const batch = lines.map((l, i) => {
        const [roll, code, sub, intMarks, extMarks, cr] = l.split(",");
        const total = Number(intMarks) + Number(extMarks);
        return {
          id: `m-bulk-${Date.now()}-${i}`,
          studentId: `std-${roll.trim()}`,
          rollNo: roll.trim(),
          subjectCode: code.trim(),
          subjectName: sub.trim(),
          internalMarks: Number(intMarks),
          externalMarks: Number(extMarks),
          totalMarks: total,
          grade: total >= 90 ? "O" : total >= 80 ? "A+" : total >= 70 ? "A" : total >= 60 ? "B+" : "B",
          credits: Number(cr || 4),
          evaluatedBy: currentUser?.name || "Dr. H.S. Bains",
        };
      });
      setMarksList([...batch, ...marksList]);
      alert(`Committed ${batch.length} subject marks to LTSU Database!`);
    } catch (e) {
      alert("Invalid CSV Format! Use: Roll,Code,Subject,Internal,External,Credits");
    }
  };

  const handleFileUploadReader = (
    e: React.ChangeEvent<HTMLInputElement>, 
    onContent: (content: string, fileName: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      onContent(text, file.name);
      alert(`File "${file.name}" loaded successfully from computer/drive!`);
    };
    reader.readAsText(file);
  };

  // Vault Handlers
  const handleDecryptSinglePaper = (paperId: string) => {
    if (!canPerformAction(["teacher", "admin"])) {
      alert("Access Denied: Only Authorized Exam Officers / Instructors can decrypt examination papers.");
      return;
    }
    const targetPaper = paperVaultList.find(p => p.id === paperId);
    if (!targetPaper) return;

    const enteredPass = vaultPasswords[paperId] || "";
    if (enteredPass.trim() === targetPaper.vaultPassword) {
      setPaperVaultList(prev => prev.map(p => p.id === paperId ? { ...p, isUnlocked: true } : p));
      setVaultPasswords(prev => ({ ...prev, [paperId]: "" }));
      alert(`Cryptographic seal broken for ${targetPaper.subjectCode}! Question Paper unlocked.`);
    } else {
      alert(`Invalid Passkey for ${targetPaper.subjectCode}! Please enter the exact password set for this paper.`);
    }
  };

  const handleDeletePaperVaultItem = (paperId: string) => {
    if (!canPerformAction(["admin"])) {
      alert("Access Denied: Only Central Vault Administrator can purge question paper packages.");
      return;
    }
    if (!confirm("Permanently delete this encrypted question paper package from vault?")) return;
    setPaperVaultList(prev => prev.filter(p => p.id !== paperId));
    alert("Paper package deleted from vault.");
  };

  // Payment Verification Handlers
  const handleApprovePayment = (ticketId: string) => {
    if (!canPerformAction(["admin"])) {
      alert("Access Denied: Finance Audit clearances require Admin authority.");
      return;
    }
    setRecheckTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      status: "FEE_CLEARED_APPROVED",
      discrepancyNote: undefined,
      verifiedBy: `${currentUser?.name || "COE Admin"} (Cleared)`,
      verifiedAt: "01/09/2026, 16:35"
    } : t));
    alert("Payment verified & APPROVED! Student petition is now officially cleared & active.");
  };

  const handleDoubtPayment = (ticketId: string) => {
    if (!canPerformAction(["admin"])) return;
    const note = prompt("Enter Discrepancy / Doubt Note for this UTR (e.g. UTR not found in bank statement / Amount mismatch):");
    if (!note) return;
    setRecheckTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      status: "DOUBT_FLAGGED",
      discrepancyNote: note,
      verifiedBy: `${currentUser?.name || "COE Admin"} (Flagged Doubt: ${note})`,
      verifiedAt: "01/09/2026, 16:35"
    } : t));
    alert("Payment flagged under DOUBT / INQUIRY. Student has been notified in Examination Module.");
  };

  const handleRejectPayment = (ticketId: string) => {
    if (!canPerformAction(["admin"])) return;
    const reason = prompt("Enter Rejection Reason (e.g. Fake / Duplicate Transaction):");
    if (!reason) return;
    setRecheckTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      status: "REJECTED",
      discrepancyNote: reason,
      verifiedBy: `${currentUser?.name || "COE Admin"} (Rejected: ${reason})`,
      verifiedAt: "01/09/2026, 16:35"
    } : t));
    alert("Payment reference rejected.");
  };

  // Admit Card Faculty Actions
  const handleTeacherApproveAdmitCard = (cardId: string) => {
    if (!canPerformAction(["teacher", "admin"])) return;
    setAdmitCards(prev => prev.map(c => c.id === cardId ? {
      ...c,
      status: "APPROVED",
      approvedByTeacher: `${currentUser?.name} (${currentUser?.assignedSubject?.split(" ")[0] || "Faculty Incharge"})`,
      approvedAt: new Date().toLocaleTimeString()
    } : c));
    alert("Admit card approved and issued to student portal!");
  };

  const handleTeacherHoldAdmitCard = (cardId: string) => {
    if (!canPerformAction(["teacher", "admin"])) return;
    setAdmitCards(prev => prev.map(c => c.id === cardId ? {
      ...c,
      status: "DISAPPROVED",
      approvedByTeacher: `Put On Hold by ${currentUser?.name}`,
      approvedAt: new Date().toLocaleTimeString()
    } : c));
    alert("Admit card placed on hold!");
  };

  // Admin User Approvals
  const handleApproveUserAccount = async (userId: string) => {
    if (!canPerformAction(["admin"])) return;
    try {
      await fetch(`/api/admin/approve-user/${userId}`, { method: "POST" }).catch(() => null);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      alert("User registration verified and activated!");
    } catch (e) {
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleRejectUserAccount = async (userId: string) => {
    if (!canPerformAction(["admin"])) return;
    if (!confirm("Are you sure you want to reject this registration application?")) return;
    try {
      await fetch(`/api/admin/reject-user/${userId}`, { method: "POST" }).catch(() => null);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      alert("Registration application rejected.");
    } catch (e) {
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  // Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const cleanEmail = loginEmail.trim().toLowerCase();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.ok) {
        setCurrentUser(data.user);
        const userRole = (data.user.role || "").toLowerCase() as UserRole;
        setActiveModule(ALLOWED_MODULES[userRole][0]);
        setActiveTab(ALLOWED_EXAM_TABS[userRole][0]);
        return;
      } else {
        setAuthError(data.error);
      }
    } catch (err) {
      if (cleanEmail === "admin@ltsu.ac.in" && loginPassword === "admin123") {
        setCurrentUser({ id: "admin-01", name: "Controller of Examinations", email: cleanEmail, role: "admin" });
        setActiveModule("examination");
        setActiveTab("sessions");
      } else if (cleanEmail === "teacher@ltsu.ac.in" && loginPassword === "teacher123") {
        setCurrentUser({ 
          id: "faculty-01", 
          name: "Dr. H.S. Bains", 
          email: cleanEmail, 
          role: "teacher", 
          assignedSubject: "CSE-501 (Advanced Cryptography & PKI)", 
          department: "B.Tech. CSE (Cyber Security)" 
        });
        setActiveModule("examination");
        setActiveTab("sessions");
      } else if (
        (cleanEmail === "student@ltsu.ac.in" || cleanEmail === "24100030033@ltsu.ac.in" || cleanEmail === "24100030033@ltsu.ac.in" || cleanEmail === "24100030033") && 
        loginPassword === "student123"
      ) {
        setCurrentUser({ 
          id: "student-01", 
          name: "Manpreet Singh", 
          email: cleanEmail, 
          role: "student", 
          rollNo: "24100030033", 
          department: "B.Tech. CSE (Cyber Security)" 
        });
        setActiveModule("examination");
        setActiveTab("admit_card");
      } else {
        setAuthError("Incorrect password or email not found!");
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (regRole === "student" && !/^241000300\d{2}$/.test(regRollNo)) {
      setAuthError("Roll Number must follow 241000300XX format (e.g. 24100030033).");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: regRole,
          rollNo: regRole === "student" ? regRollNo : null,
          employeeId: regRole === "teacher" ? regEmpId : null,
          assignedSubject: regRole === "teacher" ? regAssignedSubject : null,
          department: regDept,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setAuthSuccess("Registration submitted! Account sent for Admin activation.");
        setAuthMode("login");
      }
    } catch (err) {
      setAuthSuccess("Registration submitted! Admin approval pending.");
      setAuthMode("login");
    }
  };

  const handleLogout = async () => {
    stopCameraScanner();
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    setCurrentUser(null);
  };

  // Computed Scoped Role States
  const currentRoll = currentUser?.rollNo || "24100030033";
  const studentAdmitCard = admitCards.find(ac => ac.rollNo === currentRoll || ac.rollNo === "24100030033");
  const studentUmcCase = umcList.find(u => u.rollNo === currentRoll || u.rollNo === "24100030033");
  const studentMarksRows = marksList.filter(m => m.rollNo === currentRoll || m.rollNo === "24100030033");
  const gradePoints: Record<string, number> = { O: 10, "A+": 9, A: 8, "B+": 7, B: 6, F: 0 };
  const totalCredits = studentMarksRows.reduce((acc, curr) => acc + (curr.credits || 4), 0);
  const earnedPoints = studentMarksRows.reduce((acc, curr) => acc + (gradePoints[curr.grade] || 8) * (curr.credits || 4), 0);
  const sgpa = totalCredits > 0 ? (earnedPoints / totalCredits).toFixed(2) : "8.85";
  const pendingPaymentsCount = recheckTickets.filter(t => t.status === "PENDING_FEE_VERIFICATION" || t.status === "DOUBT_FLAGGED").length;

  const visibleVaultPapers = isTeacher
    ? paperVaultList.filter(p => p.subjectCode === "CSE-501" || currentUser?.assignedSubject?.includes(p.subjectCode))
    : paperVaultList;

  const teacherClassAdmitCards = admitCards.filter(ac => 
    !currentUser?.department || ac.department.toLowerCase().includes("cyber security") || ac.department === currentUser?.department
  );

  const totalAdmitCards = admitCards.length;
  const approvedAdmitCards = admitCards.filter(c => c.status === "APPROVED").length;
  const pendingAdmitCards = admitCards.filter(c => c.status === "PENDING").length;
  const holdAdmitCards = admitCards.filter(c => c.status === "DISAPPROVED").length;

  const filteredAdmitCards = admitCards.filter(c => 
    c.studentName.toLowerCase().includes(admitSearchQuery.toLowerCase()) ||
    c.rollNo.includes(admitSearchQuery) ||
    (c.approvedByTeacher && c.approvedByTeacher.toLowerCase().includes(admitSearchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
          <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
          <span>Connecting to LTSU Central Enterprise Ledger...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW A: AUTHENTICATION
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-4 font-sans text-slate-800">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in">
          <div className="bg-[#2b3a67] p-6 text-white text-center">
            <div className="h-14 w-14 rounded-full bg-white text-[#2b3a67] font-bold text-xl flex items-center justify-center mx-auto mb-2 shadow-inner">
              LTSU
            </div>
            <h2 className="text-lg font-bold">Lamrin Tech Skills University</h2>
            <p className="text-xs text-slate-300">Central Operations Hub · Role-Based Enterprise System</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex border rounded-xl overflow-hidden p-1 bg-slate-100 text-xs font-bold">
              <button
                onClick={() => { setAuthMode("login"); setAuthError(""); setAuthSuccess(""); }}
                className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                  authMode === "login" ? "bg-[#2b3a67] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode("register"); setAuthError(""); setAuthSuccess(""); }}
                className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                  authMode === "register" ? "bg-[#2b3a67] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                New Registration
              </button>
            </div>

            {authError && <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-lg border border-rose-200">{authError}</div>}
            {authSuccess && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">{authSuccess}</div>}

            {authMode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">University Email</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@ltsu.ac.in, teacher@ltsu.ac.in, or student@ltsu.ac.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2b3a67] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-md text-xs mt-2"
                >
                  Sign In to Enterprise Portal
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRegRole("student")} className={`py-2 font-bold rounded-lg border cursor-pointer ${regRole === "student" ? "bg-amber-500 text-white border-amber-600" : "bg-slate-50 text-slate-700"}`}>Student</button>
                  <button type="button" onClick={() => setRegRole("teacher")} className={`py-2 font-bold rounded-lg border cursor-pointer ${regRole === "teacher" ? "bg-amber-500 text-white border-amber-600" : "bg-slate-50 text-slate-700"}`}>Faculty</button>
                </div>
                <div><label className="block font-bold mb-1">Full Legal Name</label><input required value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                <div><label className="block font-bold mb-1">Official University Email</label><input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                
                {regRole === "student" ? (
                  <div><label className="block font-bold mb-1">LTSU Roll Number (241000300XX)</label><input required value={regRollNo} onChange={(e) => setRegRollNo(e.target.value)} className="w-full p-2 border rounded-lg font-mono font-bold text-blue-800" /></div>
                ) : (
                  <>
                    <div><label className="block font-bold mb-1">Employee Code</label><input required value={regEmpId} onChange={(e) => setRegEmpId(e.target.value)} placeholder="EMP-8921" className="w-full p-2 border rounded-lg font-mono" /></div>
                    <div>
                      <label className="block font-bold mb-1">Teaching Subject Assignment</label>
                      <select value={regAssignedSubject} onChange={(e) => setRegAssignedSubject(e.target.value)} className="w-full border rounded-lg p-2 font-medium">
                        <option value="CSE-501 (Advanced Cryptography & PKI)">CSE-501 (Advanced Cryptography & PKI)</option>
                        <option value="CSE-502 (Ethical Hacking & Penetration Testing)">CSE-502 (Ethical Hacking & Penetration Testing)</option>
                        <option value="CSE-503 (Cloud Security & Zero-Trust Architecture)">CSE-503 (Cloud Security & Zero-Trust Architecture)</option>
                        <option value="CSE-504 (Cyber Forensics & Incident Response)">CSE-504 (Cyber Forensics & Incident Response)</option>
                      </select>
                    </div>
                  </>
                )}

                <div><label className="block font-bold mb-1">Department</label><input required value={regDept} onChange={(e) => setRegDept(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                <div><label className="block font-bold mb-1">Password</label><input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full p-2 border rounded-lg font-mono" /></div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-md mt-2">Submit Application</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: AUTHENTICATED REAL ERP DASHBOARD WITH ADVANCED RBAC
  // =========================================================================
  const allowedModules = ALLOWED_MODULES[role] || [];
  const allowedExamTabs = ALLOWED_EXAM_TABS[role] || [];

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-800 font-sans antialiased">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b bg-[#2b3a67] px-6 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-[#2b3a67] shadow-inner">
            LTSU
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide">Lamrin Tech Skills University</h1>
            <p className="text-[11px] text-slate-300">Central Enterprise Portal · Secured Role Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-xs font-semibold text-white">{currentUser.name}</span>
            <span className="inline-block rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
              {currentUser.role} {currentUser.rollNo ? `· ${currentUser.rollNo}` : ""}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer ml-2 shadow-xs border border-rose-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* DYNAMIC MASTER MODULES BAR FILTERED BY RBAC PERMISSIONS */}
      <div className="bg-white text-slate-800 px-6 py-2 overflow-x-auto border-b border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 max-w-7xl mx-auto text-xs whitespace-nowrap">
          {allowedModules.includes("admission") && (
            <button onClick={() => setActiveModule("admission")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "admission" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <GraduationCap className="h-4 w-4" /> 🎓 Admission
            </button>
          )}
          {allowedModules.includes("academic") && (
            <button onClick={() => setActiveModule("academic")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "academic" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <BookOpen className="h-4 w-4" /> 📚 Academic
            </button>
          )}
          {allowedModules.includes("examination") && (
            <button onClick={() => setActiveModule("examination")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "examination" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <FileText className="h-4 w-4" /> ✍️ Examination
            </button>
          )}
          {allowedModules.includes("finance") && (
            <button onClick={() => setActiveModule("finance")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "finance" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <DollarSign className="h-4 w-4" /> 💰 Finance & Fee
            </button>
          )}
          {allowedModules.includes("hr") && (
            <button onClick={() => setActiveModule("hr")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "hr" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <Briefcase className="h-4 w-4" /> 👥 HR & Staff
            </button>
          )}
          {allowedModules.includes("student_sys") && (
            <button onClick={() => setActiveModule("student_sys")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "student_sys" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <Users className="h-4 w-4" /> 🎓 Student System
            </button>
          )}
          {allowedModules.includes("library") && (
            <button onClick={() => setActiveModule("library")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "library" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <Book className="h-4 w-4" /> 📖 Library
            </button>
          )}
          {allowedModules.includes("hostel") && (
            <button onClick={() => setActiveModule("hostel")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "hostel" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <Home className="h-4 w-4" /> 🏢 Hostel
            </button>
          )}
          {allowedModules.includes("transport") && (
            <button onClick={() => setActiveModule("transport")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "transport" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <Bus className="h-4 w-4" /> 🚌 Transport
            </button>
          )}
          {allowedModules.includes("placement") && (
            <button onClick={() => setActiveModule("placement")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "placement" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <Building className="h-4 w-4" /> 💼 Placement
            </button>
          )}
          {allowedModules.includes("research") && (
            <button onClick={() => setActiveModule("research")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "research" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <FlaskConical className="h-4 w-4" /> 🔬 Research Cell
            </button>
          )}
          {allowedModules.includes("communication") && (
            <button onClick={() => setActiveModule("communication")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "communication" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <MessageSquare className="h-4 w-4" /> 📢 Communication
            </button>
          )}
          {allowedModules.includes("stock") && (
            <button onClick={() => setActiveModule("stock")} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeModule === "stock" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>
              <HardDrive className="h-4 w-4" /> 📦 Stock & Inventory
            </button>
          )}
        </div>
      </div>

      {/* STUDENT UMC BANNER ALERT */}
      {isStudent && studentUmcCase && activeModule === "examination" && (
        <div className="bg-rose-600 text-white px-6 py-3 shadow-md animate-in fade-in">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-white shrink-0 animate-bounce" />
              <div>
                <span className="font-bold uppercase tracking-wide bg-rose-800 px-2 py-0.5 rounded mr-2">UMC Malpractice Alert</span>
                <span>You are flagged under Unfair Means Case ticket: <b className="font-mono underline">{studentUmcCase.ticketNo}</b> ({studentUmcCase.subjectCode}). Hearing: {studentUmcCase.hearingDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXAMINATION SUB-NAV WITH DYNAMIC ROLE AUTHORIZATION */}
      {activeModule === "examination" && (
        <div className="bg-white border-b px-8 py-2.5 shadow-xs">
          <div className="flex items-center gap-2 max-w-7xl mx-auto overflow-x-auto text-xs">
            {allowedExamTabs.includes("sessions") && (
              <button onClick={() => setActiveTab("sessions")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all ${activeTab === "sessions" ? "bg-amber-500 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                Exam Sessions
              </button>
            )}

            {allowedExamTabs.includes("admit_card") && (
              <button onClick={() => setActiveTab("admit_card")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "admit_card" ? "bg-blue-700 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <QrCode className="h-4 w-4" />
                <span>Official QR Hall Pass</span>
              </button>
            )}

            {allowedExamTabs.includes("student_datesheet") && (
              <button onClick={() => setActiveTab("student_datesheet")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "student_datesheet" ? "bg-blue-700 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <Calendar className="h-4 w-4" />
                <span>Date Sheet & Seating Matrix</span>
              </button>
            )}

            {allowedExamTabs.includes("student_marksheet") && (
              <button onClick={() => setActiveTab("student_marksheet")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "student_marksheet" ? "bg-emerald-700 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <FileText className="h-4 w-4" />
                <span>Official Marksheet (SGPA)</span>
              </button>
            )}

            {allowedExamTabs.includes("rechecking") && (
              <button onClick={() => setActiveTab("rechecking")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "rechecking" ? "bg-purple-700 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <Banknote className="h-4 w-4" />
                <span>Re-evaluation Grievance</span>
              </button>
            )}

            {allowedExamTabs.includes("teacher_admit_approval") && (
              <button onClick={() => setActiveTab("teacher_admit_approval")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "teacher_admit_approval" ? "bg-blue-700 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <UserCog className="h-4 w-4" />
                <span>Class Admit Card Desk ({teacherClassAdmitCards.length})</span>
              </button>
            )}

            {allowedExamTabs.includes("faculty_invigilation") && (
              <button onClick={() => setActiveTab("faculty_invigilation")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "faculty_invigilation" ? "bg-slate-800 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <Building className="h-4 w-4" />
                <span>My Class Seating & Attendance</span>
              </button>
            )}

            {allowedExamTabs.includes("admin_admit_cards") && (
              <button onClick={() => setActiveTab("admin_admit_cards")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "admin_admit_cards" ? "bg-blue-800 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <FileCheck className="h-4 w-4" />
                <span>Admit Card Issue & Status Hub ({admitCards.length})</span>
              </button>
            )}

            {allowedExamTabs.includes("admin_classes") && (
              <button onClick={() => setActiveTab("admin_classes")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "admin_classes" ? "bg-blue-800 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <Layers className="h-4 w-4" />
                <span>Classroom Intelligence Hub</span>
              </button>
            )}

            {allowedExamTabs.includes("admin_payments") && (
              <button onClick={() => setActiveTab("admin_payments")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "admin_payments" ? "bg-purple-800 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <Receipt className="h-4 w-4" />
                <span>Fee Clearance Desk ({pendingPaymentsCount})</span>
              </button>
            )}

            {allowedExamTabs.includes("qr_scanner") && (
              <button onClick={() => setActiveTab("qr_scanner")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "qr_scanner" ? "bg-blue-700 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <ScanLine className="h-4 w-4" />
                <span>Optical QR Scanner</span>
              </button>
            )}

            {allowedExamTabs.includes("results_hub") && (
              <button onClick={() => setActiveTab("results_hub")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "results_hub" ? "bg-emerald-700 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <FileSpreadsheet className="h-4 w-4" />
                <span>Result Uploading Engine</span>
              </button>
            )}

            {allowedExamTabs.includes("umc_region") && (
              <button onClick={() => setActiveTab("umc_region")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "umc_region" ? "bg-rose-700 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <AlertOctagon className="h-4 w-4" />
                <span>UMC Incident Desk</span>
              </button>
            )}

            {allowedExamTabs.includes("paper_vault") && (
              <button onClick={() => setActiveTab("paper_vault")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "paper_vault" ? "bg-purple-800 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <KeyRound className="h-4 w-4" />
                <span>Paper Vault Manager</span>
              </button>
            )}

            {allowedExamTabs.includes("admin_approvals") && (
              <button onClick={() => setActiveTab("admin_approvals")} className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeTab === "admin_approvals" ? "bg-slate-800 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-700"}`}>
                <UserCheck className="h-4 w-4" />
                <span>User Approvals ({pendingUsers.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Operational Workspaces */}
      <main className="mx-auto max-w-7xl p-6">
        
        {/* ========================================================================= */}
        {/* MODULE SLOTS                                                              */}
        {/* ========================================================================= */}
        {activeModule === "admission" && allowedModules.includes("admission") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="h-6 w-6 text-blue-700" />🎓 Admission Management</h2>
            <p className="text-xs text-slate-500">New candidate applications, counseling desks, and document verification portal slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "academic" && allowedModules.includes("academic") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><BookOpen className="h-6 w-6 text-blue-700" />📚 Academic Management</h2>
            <p className="text-xs text-slate-500">Curriculum design, syllabus tracking, course allocation, and semester schedules slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "finance" && allowedModules.includes("finance") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><DollarSign className="h-6 w-6 text-emerald-700" />💰 Finance & Fee Management</h2>
            <p className="text-xs text-slate-500">Semester tuition fees, online receipts, salary ledger, and accounts audit slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "hr" && allowedModules.includes("hr") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Briefcase className="h-6 w-6 text-purple-700" />👥 HR & Staff Management</h2>
            <p className="text-xs text-slate-500">Faculty profiles, payroll, staff leave desk, and biometric attendance logs slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "student_sys" && allowedModules.includes("student_sys") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Users className="h-6 w-6 text-indigo-700" />🎓 Student Management System</h2>
            <p className="text-xs text-slate-500">Student master records, ID card generation, academic history, and conduct records slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "library" && allowedModules.includes("library") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Book className="h-6 w-6 text-amber-700" />📖 Library Management System</h2>
            <p className="text-xs text-slate-500">Book inventory, RFID issue/return, digital catalog, and fine tracking slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "hostel" && allowedModules.includes("hostel") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Home className="h-6 w-6 text-rose-700" />🏢 Hostel Management</h2>
            <p className="text-xs text-slate-500">Room allocation, mess management, leave pass generation, and warden logs slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "transport" && allowedModules.includes("transport") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Bus className="h-6 w-6 text-blue-700" />🚌 Transport Management</h2>
            <p className="text-xs text-slate-500">Bus routes, live GPS vehicle tracking, driver allocation, and pass verification slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "placement" && allowedModules.includes("placement") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Building className="h-6 w-6 text-[#2b3a67]" />💼 Placement Management</h2>
            <p className="text-xs text-slate-500">Corporate drives, student resume repository, interview scheduling, and offer letters slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "research" && allowedModules.includes("research") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><FlaskConical className="h-6 w-6 text-purple-700" />🔬 Research & Project Cell</h2>
            <p className="text-xs text-slate-500">Grant approvals, publication tracking, patents, and capstone project monitoring slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "communication" && allowedModules.includes("communication") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-emerald-700" />📢 Communication & Collaboration</h2>
            <p className="text-xs text-slate-500">University circular broadcasts, SMS/Email alerts, and faculty-student messaging slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {activeModule === "stock" && allowedModules.includes("stock") && (
          <div className="bg-white rounded-2xl border p-8 shadow-xs space-y-3 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><HardDrive className="h-6 w-6 text-indigo-700" />📦 Stock & Inventory</h2>
            <p className="text-xs text-slate-500">Hardware assets, laboratory equipment, stationery registers, and procurement requests slot.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">Section Ready for Operational Integration</div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EXAMINATION MANAGEMENT MODULE                                             */}
        {/* ========================================================================= */}
        {activeModule === "examination" && allowedModules.includes("examination") && (
          <>
            {/* 1. STUDENT VIEW: OFFICIAL QR HALL PASS (ADMIT CARD) */}
            {activeTab === "admit_card" && isStudent && (
              <div className="max-w-4xl mx-auto rounded-2xl border-2 border-slate-300 bg-white p-8 shadow-sm space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-[#2b3a67] text-white font-bold text-2xl flex items-center justify-center shadow-md">LTSU</div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">LAMRIN TECH SKILLS UNIVERSITY PUNJAB</h2>
                      <p className="text-xs text-slate-600 font-semibold">Established under Punjab Act No. 22 of 2021 | Recognized by UGC</p>
                      <p className="text-[11px] text-blue-800 font-bold uppercase mt-0.5">Official Examination Hall Ticket · Admit Card</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center border-2 border-slate-900 p-2 rounded-xl bg-slate-50">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(studentAdmitCard?.passToken || "LTSU-PASS-24100030033-9A82")}`} alt="QR" className="h-24 w-24 object-contain" />
                    <span className="text-[9px] font-mono font-bold text-blue-700 mt-1">{studentAdmitCard?.passToken || "LTSU-PASS-24100030033"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border">
                  <div><span className="text-slate-400 block font-semibold text-[10px]">Candidate</span><b className="text-slate-900 text-sm">{currentUser?.name}</b></div>
                  <div><span className="text-slate-400 block font-semibold text-[10px]">Roll No</span><b className="font-mono text-blue-700 text-sm">{currentRoll}</b></div>
                  <div><span className="text-slate-400 block font-semibold text-[10px]">Room & Desk</span><b className="text-emerald-700">{studentAdmitCard?.hallNumber || "Hall B-201"} ({studentAdmitCard?.deskNumber || "Desk #04"})</b></div>
                  <div><span className="text-slate-400 block font-semibold text-[10px]">Status</span><b className="text-emerald-600 uppercase font-bold">{studentAdmitCard?.status || "APPROVED BY COE"}</b></div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Registered Examination Course Roster</h4>
                  <table className="w-full text-left text-xs border rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 border-b font-bold uppercase text-slate-700 text-[10px]">
                      <tr><th className="p-3">Course Code</th><th className="p-3">Course Title</th><th className="p-3">Date</th><th className="p-3">Timing</th><th className="p-3 text-right">Invigilator Sign</th></tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {dateSheet.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-700">{sub.subjectCode}</td>
                          <td className="p-3 font-semibold">{sub.subjectName}</td>
                          <td className="p-3 font-medium">{sub.examDate}</td>
                          <td className="p-3 text-slate-600">{sub.examTime}</td>
                          <td className="p-3 text-right text-slate-400 italic">Verified at Hall</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-[11px] text-amber-950">
                  <h5 className="font-bold flex items-center gap-1.5 uppercase text-amber-900">
                    <AlertCircle className="h-4 w-4 text-amber-700" />
                    Mandatory Examination Instructions for Candidate:
                  </h5>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed">
                    <li>Candidates must report at the designated examination hall at least <b>30 minutes</b> prior to exam start.</li>
                    <li>Electronic gadgets (mobile phones, smartwatches, Bluetooth devices) inside the exam hall are strictly prohibited and constitute a <b>UMC</b>.</li>
                    <li>Candidate must present this signed <b>Admit Card along with the official Student ID Card</b> at the gate checkpoint.</li>
                  </ol>
                </div>

                <button onClick={() => window.print()} className="w-full bg-[#2b3a67] hover:bg-blue-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs shadow-md">
                  <Printer className="h-4 w-4" /> Print Official Signed Hall Ticket (PDF)
                </button>
              </div>
            )}

            {/* 2. STUDENT VIEW: DATE SHEET & SEATING MATRIX */}
            {activeTab === "student_datesheet" && isStudent && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-700" />
                      <span>Official Examination Date Sheet & Seating Allotment</span>
                    </h2>
                    <p className="text-xs text-slate-500">Candidate: <b>{currentUser?.name}</b> (Roll: <b className="font-mono text-blue-700">{currentRoll}</b>)</p>
                  </div>
                  <button onClick={() => window.print()} className="border bg-white text-slate-700 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Printer className="h-4 w-4" /> Print Date Sheet
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dateSheet.map((ds) => (
                    <div key={ds.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-mono font-bold text-blue-700 text-sm">{ds.subjectCode}</span>
                        <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded border">{ds.examDate}</span>
                      </div>
                      <div className="font-bold text-sm text-slate-900">{ds.subjectName}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border">
                        <div><span className="text-slate-400 block text-[10px] uppercase">Timing</span><span className="font-medium">{ds.examTime}</span></div>
                        <div><span className="text-slate-400 block text-[10px] uppercase">Centre & Hall</span><span className="font-bold">{ds.hall}</span></div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t">
                        <span className="text-slate-500">Your Allotted Seating:</span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold font-mono px-3 py-1 rounded-lg">{ds.desk} (Dummy Seal: DUMMY-9024)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. STUDENT VIEW: OFFICIAL MARKSHEET (SGPA TRANSCRIPT) */}
            {activeTab === "student_marksheet" && isStudent && (
              <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Official Semester Grade Transcript</h3>
                    <p className="text-xs text-slate-500">Candidate: {currentUser?.name} (Roll: <b className="font-mono text-blue-700">{currentRoll}</b>)</p>
                  </div>
                  <div className="text-right bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <span className="text-2xl font-bold text-emerald-700 font-mono">{sgpa}</span>
                    <span className="block text-[10px] uppercase font-bold text-emerald-800">Calculated SGPA</span>
                  </div>
                </div>

                <table className="w-full text-left text-xs border rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 border-b font-bold uppercase text-slate-600 text-[11px]">
                    <tr><th className="p-3.5">Code</th><th className="p-3.5">Subject</th><th className="p-3.5 text-center">Internal (50)</th><th className="p-3.5 text-center">External (50)</th><th className="p-3.5 text-center">Total (100)</th><th className="p-3.5 text-center">Grade</th><th className="p-3.5 text-right">Status</th></tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {studentMarksRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-mono font-bold text-blue-700">{row.subjectCode}</td>
                        <td className="p-3.5 font-medium">{row.subjectName}</td>
                        <td className="p-3.5 text-center">{row.internalMarks}</td>
                        <td className="p-3.5 text-center">{row.externalMarks}</td>
                        <td className="p-3.5 text-center font-bold">{row.totalMarks}</td>
                        <td className="p-3.5 text-center"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">{row.grade}</span></td>
                        <td className="p-3.5 text-right font-bold text-emerald-600">PASS</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button onClick={() => window.print()} className="w-full bg-[#2b3a67] hover:bg-blue-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs shadow-md">
                  <Download className="h-4 w-4" /> Download Official Marksheet (PDF)
                </button>
              </div>
            )}

            {/* 4. STUDENT VIEW: RE-EVALUATION GRIEVANCE PORTAL */}
            {activeTab === "rechecking" && isStudent && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
                <div className="lg:col-span-6 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 text-xs">
                    <div className="border-b pb-3">
                      <h3 className="text-base font-bold text-slate-900">Apply for Re-checking / Re-Examination</h3>
                      <p className="text-xs text-slate-500">Official academic petition submitted directly to Controller of Examinations (COE).</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); if (!recheckReason.trim()) return; setIsPaymentModalOpen(true); }} className="space-y-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-2">Select Grievance Category</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div onClick={() => setPetitionType("rechecking")} className={`rounded-xl border-2 p-3.5 cursor-pointer ${petitionType === "rechecking" ? "border-purple-600 bg-purple-50" : "border-slate-200"}`}>
                            <div className="flex justify-between font-bold mb-1"><span>Paper Re-checking</span><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px]">₹500</span></div>
                            <p className="text-[11px] text-slate-500">Recounting & Answer Sheet Verification</p>
                          </div>
                          <div onClick={() => setPetitionType("re_examination")} className={`rounded-xl border-2 p-3.5 cursor-pointer ${petitionType === "re_examination" ? "border-purple-600 bg-purple-50" : "border-slate-200"}`}>
                            <div className="flex justify-between font-bold mb-1"><span>Re-Examination</span><span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px]">₹1500</span></div>
                            <p className="text-[11px] text-slate-500">Re-appear in upcoming cycle</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Target Examination Subject</label>
                        <select value={recheckSubCode} onChange={(e) => setRecheckSubCode(e.target.value)} className="w-full border rounded-xl p-2.5 font-medium bg-white">
                          <option value="CSE-501">CSE-501 · Advanced Cryptography & PKI</option>
                          <option value="CSE-502">CSE-502 · Ethical Hacking & Penetration Testing</option>
                          <option value="CSE-503">CSE-503 · Cloud Security & Zero-Trust Architecture</option>
                        </select>
                      </div>

                      <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border">
                        <div className="grid grid-cols-3 gap-2">
                          <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Current SGPA</span><b className="text-emerald-700 font-mono">{sgpa}</b></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Declared Score</span><b className="text-blue-700 font-mono">{subjectScoreMap[recheckSubCode]?.marks} / 100</b></div>
                          <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Grade</span><b className="text-purple-700">{subjectScoreMap[recheckSubCode]?.grade}</b></div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Reason / Justification</label>
                        <textarea rows={3} required value={recheckReason} onChange={(e) => setRecheckReason(e.target.value)} placeholder="Specify question numbers or evaluation query..." className="w-full border rounded-xl p-2.5 outline-none bg-white" />
                      </div>

                      <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3.5 rounded-xl cursor-pointer shadow-md text-xs flex items-center justify-center gap-2">
                        <CreditCard className="h-4 w-4" /> Proceed to Pay {petitionType === "rechecking" ? "₹500" : "₹1500"} via Official LTSU QR
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 min-h-[420px] text-xs">
                    <h3 className="text-base font-bold text-slate-900">Your Grievance History</h3>
                    {recheckTickets.map((t) => (
                      <div key={t.id} className="rounded-xl border p-4 space-y-2 bg-slate-50">
                        <div className="flex justify-between font-bold">
                          <span className="text-purple-700 font-mono">{t.ticketNo}</span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">{t.status}</span>
                        </div>
                        <div><b>{t.subjectCode} · {t.subjectName}</b> (₹{t.amount})</div>
                        <div className="font-mono text-[11px] text-slate-500">UTR: {t.transactionId}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: ADMIN ADMIT CARD ISSUE & STATUS HUB */}
            {activeTab === "admin_admit_cards" && isAdmin && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-blue-700" />
                      <span>Admit Card Issue & Status Hub</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Track approved vs pending cards, search candidate records, and audit which faculty member approved each card.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Audit Register</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-4 bg-white border rounded-2xl shadow-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Hall Tickets</span>
                    <b className="text-xl text-slate-900">{totalAdmitCards}</b>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs">
                    <span className="text-emerald-700 block text-[10px] uppercase font-bold">Approved & Released</span>
                    <b className="text-xl text-emerald-800">{approvedAdmitCards}</b>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs">
                    <span className="text-amber-700 block text-[10px] uppercase font-bold">Pending Review</span>
                    <b className="text-xl text-amber-800">{pendingAdmitCards}</b>
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl shadow-xs">
                    <span className="text-rose-700 block text-[10px] uppercase font-bold">Disapproved / On Hold</span>
                    <b className="text-xl text-rose-800">{holdAdmitCards}</b>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                      <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by Student Name, Roll No, or Teacher..."
                        value={admitSearchQuery}
                        onChange={(e) => setAdmitSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border rounded-xl outline-none font-medium bg-slate-50"
                      />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl cursor-pointer border flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5 text-blue-700" />
                        <span>Upload CSV from Computer</span>
                        <input
                          type="file"
                          accept=".csv, .txt, .xlsx, .xls"
                          className="hidden"
                          onChange={(e) => handleFileUploadReader(e, (content) => setBulkAdmitCsvText(content.trim()))}
                        />
                      </label>
                      <button 
                        onClick={handleBulkAdmitCardUpload} 
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs"
                      >
                        Issue Batch
                      </button>
                    </div>
                  </div>

                  <textarea 
                    rows={2} 
                    value={bulkAdmitCsvText} 
                    onChange={(e) => setBulkAdmitCsvText(e.target.value)} 
                    className="w-full p-2.5 border rounded-xl font-mono text-xs outline-none bg-slate-50/50"
                  />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b font-bold uppercase text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-3.5">CANDIDATE DETAILS</th>
                        <th className="p-3.5">DEPARTMENT & ROOM</th>
                        <th className="p-3.5">APPROVED BY TEACHER / INCHARGE</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">ADMIN CONTROLS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {filteredAdmitCards.map((ac) => (
                        <tr key={ac.id} className="hover:bg-slate-50">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{ac.studentName}</div>
                            <div className="font-mono font-bold text-blue-700">{ac.rollNo}</div>
                            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">{ac.passToken}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{ac.department}</div>
                            <div className="text-slate-500 font-medium text-[11px]">{ac.hallNumber} ({ac.deskNumber})</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-800 flex items-center gap-1">
                              <UserCog className="h-3.5 w-3.5 text-indigo-600" />
                              <span>{ac.approvedByTeacher || "Not yet reviewed"}</span>
                            </div>
                            {ac.approvedAt && (
                              <div className="text-[10px] text-slate-400 font-mono">Time: {ac.approvedAt}</div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              ac.status === "APPROVED" 
                                ? "bg-emerald-100 text-emerald-800" 
                                : ac.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}>
                              {ac.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            {ac.status !== "APPROVED" ? (
                              <button
                                onClick={() => {
                                  setAdmitCards(admitCards.map(c => c.id === ac.id ? { 
                                    ...c, 
                                    status: "APPROVED",
                                    approvedByTeacher: `${currentUser?.name} (Admin Clearance)`,
                                    approvedAt: new Date().toLocaleTimeString()
                                  } : c));
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs"
                              >
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setAdmitCards(admitCards.map(c => c.id === ac.id ? { ...c, status: "DISAPPROVED" } : c));
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                              >
                                Put On Hold
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (!confirm(`Delete/Revoke Admit Card for ${ac.rollNo}?`)) return;
                                setAdmitCards(admitCards.filter(c => c.id !== ac.id));
                              }}
                              className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold p-1.5 rounded-lg text-xs cursor-pointer"
                              title="Revoke / Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW: TEACHER CLASS INCHARGE ADMIT CARD APPROVAL DESK */}
            {activeTab === "teacher_admit_approval" && isTeacher && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-blue-700" />
                      <span>Class Incharge Admit Card Review & Issuance Desk</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Assigned Section: <b>{currentUser.department}</b> · Evaluator: <b>{currentUser.name}</b>.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-xl text-xs font-bold font-mono">
                    {teacherClassAdmitCards.length} Assigned Candidates
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b font-bold uppercase text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-3.5">STUDENT NAME & ROLL</th>
                        <th className="p-3.5">DEPARTMENT & SECTION</th>
                        <th className="p-3.5">ALLOTTED DESK</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">INCHARGE VERIFICATION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {teacherClassAdmitCards.map((ac) => (
                        <tr key={ac.id} className="hover:bg-slate-50">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{ac.studentName}</div>
                            <div className="font-mono font-bold text-blue-700">{ac.rollNo}</div>
                          </td>
                          <td className="p-3.5 font-medium">
                            {ac.department} ({ac.semester})
                          </td>
                          <td className="p-3.5 font-mono text-slate-700">
                            {ac.hallNumber} - {ac.deskNumber}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              ac.status === "APPROVED" 
                                ? "bg-emerald-100 text-emerald-800" 
                                : ac.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}>
                              {ac.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            {ac.status !== "APPROVED" ? (
                              <button
                                onClick={() => handleTeacherApproveAdmitCard(ac.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs"
                              >
                                Approve & Release Card
                              </button>
                            ) : (
                              <button
                                onClick={() => handleTeacherHoldAdmitCard(ac.id)}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                              >
                                Put On Hold
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW: CLASSROOM INTELLIGENCE & TELEMETRY HUB */}
            {activeTab === "admin_classes" && isAdmin && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="h-6 w-6 text-blue-700" />
                      <span>Real-Time Classroom Intelligence & Surveillance Deck</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Live biometric desk telemetry, invigilator presence verification, CCTV status, and roll-wise seating maps.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl">
                      <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                      <span>CCTV Mesh: 100% Operational</span>
                    </span>
                    
                    <button
                      onClick={() => setIsSeatingUploadModalOpen(true)}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Seating Arrangement (CSV)</span>
                    </button>

                    <button
                      onClick={() => alert("Synchronizing all hall sensors & biometric attendance feeds...")}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      <span>Sync Feeds</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {classroomsMeta.map((meta) => {
                    const roomDesks = seatingList.filter(s => s.hallNumber === meta.hallNumber);
                    const presentCount = roomDesks.filter(s => s.attendanceStatus === "PRESENT").length;
                    const absentCount = roomDesks.filter(s => s.attendanceStatus === "ABSENT").length;
                    const pendingCount = roomDesks.filter(s => s.attendanceStatus === "PENDING").length;
                    const umcCount = roomDesks.filter(s => s.status === "BLOCKED_UMC").length;
                    const totalAssigned = roomDesks.filter(s => s.status !== "VACANT").length;
                    const occupancyPercent = totalAssigned > 0 ? Math.round((presentCount / totalAssigned) * 100) : 0;

                    return (
                      <div
                        key={meta.hallNumber}
                        onClick={() => { setSelectedClassCard(meta.hallNumber); setClassFilterStatus("ALL"); setClassSearchQuery(""); }}
                        className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs hover:border-blue-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                {meta.roomType}
                              </span>
                              <h3 className="text-lg font-bold text-slate-900 mt-1">{meta.hallNumber}</h3>
                            </div>
                            <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border">
                              {roomDesks.length} Desks
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {meta.block} · {meta.floor}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-600">Present Turnout:</span>
                            <span className={occupancyPercent >= 75 ? "text-emerald-700" : "text-amber-700"}>
                              {occupancyPercent}% ({presentCount}/{totalAssigned})
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border">
                            <div 
                              className="h-full bg-emerald-600 rounded-full transition-all" 
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 text-center text-xs bg-slate-50 p-2.5 rounded-xl border">
                          <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Present</span><b className="text-emerald-700 text-sm">{presentCount}</b></div>
                          <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Absent</span><b className="text-amber-700 text-sm">{absentCount}</b></div>
                          <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Pending</span><b className="text-slate-600 text-sm">{pendingCount}</b></div>
                          <div><span className="text-slate-400 block text-[9px] uppercase font-bold">UMC</span><b className="text-rose-700 text-sm">{umcCount}</b></div>
                        </div>

                        <div className="pt-2 border-t text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-400">Invigilator:</span>
                            <b className="truncate max-w-[170px]">{meta.assignedFaculty}</b>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span>Surveillance:</span>
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                              RECORDING
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelectedClassCard(meta.hallNumber); setClassFilterStatus("ALL"); setClassSearchQuery(""); }}
                            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-xl text-center text-xs flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Inspect Seating</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); exportClassAttendanceCSV(meta.hallNumber); }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl flex items-center justify-center gap-1 text-xs"
                            title="Download CSV Register"
                          >
                            <FileDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Modal for 2D Floor Plan */}
                {selectedClassCard && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900">{selectedClassCard} Intelligence Center</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-lg">Live Interactive Session</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {classroomsMeta.find(m => m.hallNumber === selectedClassCard)?.block} · Lead Invigilator: <b>{classroomsMeta.find(m => m.hallNumber === selectedClassCard)?.assignedFaculty}</b>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload Seating CSV</span>
                            <input
                              type="file"
                              accept=".csv, .txt"
                              className="hidden"
                              onChange={(e) => handleFileUploadReader(e, (content) => handleImportSeatingCSV(selectedClassCard, content))}
                            />
                          </label>

                          <button 
                            onClick={() => handleShuffleRoomDesks(selectedClassCard)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Shuffle className="h-3.5 w-3.5" />
                            <span>Shuffle Dummy Seals</span>
                          </button>
                          <button 
                            onClick={() => exportClassAttendanceCSV(selectedClassCard)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                            <span>Export CSV</span>
                          </button>
                          <button 
                            onClick={() => window.print()}
                            className="border bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Door Chart PDF</span>
                          </button>
                          <button 
                            onClick={() => setSelectedClassCard(null)}
                            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-2xl border text-xs">
                        <div className="relative w-full sm:w-72">
                          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Search student name or roll..."
                            value={classSearchQuery}
                            onChange={(e) => setClassSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border rounded-xl outline-none font-medium bg-white"
                          />
                        </div>

                        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
                          {["ALL", "PRESENT", "ABSENT", "PENDING", "BLOCKED_UMC"].map((statusKey) => (
                            <button
                              key={statusKey}
                              onClick={() => setClassFilterStatus(statusKey)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                classFilterStatus === statusKey
                                  ? "bg-slate-900 text-white shadow-xs"
                                  : "bg-white border text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {statusKey.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4 mx-auto max-w-sm rounded-xl border border-slate-300 bg-slate-100 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          [ Front Podium / Invigilator Whiteboard ]
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                          {seatingList
                            .filter(d => d.hallNumber === selectedClassCard)
                            .filter(d => classFilterStatus === "ALL" || (classFilterStatus === "BLOCKED_UMC" ? d.status === "BLOCKED_UMC" : d.attendanceStatus === classFilterStatus))
                            .filter(d => d.studentName.toLowerCase().includes(classSearchQuery.toLowerCase()) || d.rollNo.includes(classSearchQuery))
                            .map((desk) => {
                              const isPresent = desk.attendanceStatus === "PRESENT";
                              const isAbsent = desk.attendanceStatus === "ABSENT";
                              const isBlocked = desk.status === "BLOCKED_UMC";
                              const isVacant = desk.status === "VACANT";

                              return (
                                <div
                                  key={desk.id}
                                  className={`rounded-2xl border-2 p-3.5 space-y-2.5 transition-all bg-white shadow-xs ${
                                    isBlocked 
                                      ? "border-rose-400 bg-rose-50/40" 
                                      : isVacant
                                      ? "border-dashed border-slate-300 bg-slate-50/50"
                                      : isPresent 
                                      ? "border-emerald-400 bg-emerald-50/20" 
                                      : isAbsent
                                      ? "border-amber-400 bg-amber-50/20"
                                      : "border-slate-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="font-mono text-slate-900">{desk.deskNumber}</span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                      isBlocked 
                                        ? "bg-rose-600 text-white" 
                                        : isVacant 
                                        ? "bg-slate-200 text-slate-600" 
                                        : isPresent 
                                        ? "bg-emerald-100 text-emerald-800" 
                                        : isAbsent
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-slate-100 text-slate-600"
                                    }`}>
                                      {isBlocked ? "UMC" : isVacant ? "VACANT" : desk.attendanceStatus}
                                    </span>
                                  </div>

                                  {!isVacant ? (
                                    <div className="space-y-1 text-xs">
                                      <div className="font-bold text-slate-900 truncate">{desk.studentName}</div>
                                      <div className="font-mono font-bold text-blue-700 text-[11px]">{desk.rollNo}</div>
                                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1 border-t">
                                        <span>Seal:</span>
                                        <b className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{desk.dummyRollNo}</b>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="py-2 text-center text-xs text-slate-400">Desk Empty</div>
                                  )}

                                  {!isVacant && !isBlocked && canPerformAction(["teacher", "admin"]) && (
                                    <div className="pt-1.5 border-t">
                                      <button
                                        onClick={() => handleToggleStudentAttendance(desk.id, desk.attendanceStatus)}
                                        className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                          isPresent
                                            ? "bg-amber-100 hover:bg-amber-200 text-amber-800"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                        }`}
                                      >
                                        {isPresent ? "Mark Absent" : "Mark Present"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: ADMIN FEE CLEARANCE DESK */}
            {activeTab === "admin_payments" && isAdmin && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-purple-700" />
                      <span>Fee Clearance & Transaction Verification Desk</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Verify student bank transaction reference numbers (UTR) against bank records. Approve, flag discrepancy doubt, or reject petitions.
                    </p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 font-bold text-xs px-3 py-1 rounded-full">
                    {pendingPaymentsCount} Pending Verifications
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b font-bold uppercase text-slate-600 text-[11px]">
                      <tr>
                        <th className="p-3.5">CANDIDATE</th>
                        <th className="p-3.5">SUBJECT</th>
                        <th className="p-3.5">AMOUNT</th>
                        <th className="p-3.5">BANK UTR</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {recheckTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{ticket.studentName}</div>
                            <div className="font-mono font-bold text-blue-700">{ticket.rollNo}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{ticket.ticketNo}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-800">{ticket.subjectCode}</div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              ticket.type === "re_examination" ? "bg-amber-100 text-amber-900" : "bg-purple-100 text-purple-800"
                            }`}>
                              {ticket.type === "re_examination" ? "Re-Examination" : "Re-checking"}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold font-mono text-slate-900 text-sm">
                            ₹{ticket.amount}
                          </td>
                          <td className="p-3.5 space-y-1.5 min-w-[240px]">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Bank Ref / UTR:
                              </span>
                              <span className="font-mono font-bold text-blue-800 bg-blue-50/70 px-2 py-1 rounded border border-blue-200 block truncate max-w-[230px] text-xs">
                                {ticket.transactionId}
                              </span>
                            </div>

                            {ticket.reason && (
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700 leading-snug">
                                <span className="text-[10px] font-bold text-slate-500 block uppercase mb-0.5">
                                  Reason / Justification:
                                </span>
                                <p className="italic text-slate-600">"{ticket.reason}"</p>
                              </div>
                            )}

                            {ticket.discrepancyNote && (
                              <div className="text-[10px] text-amber-800 font-bold bg-amber-50 p-1 rounded border border-amber-200">
                                ⚠️ Discrepancy: {ticket.discrepancyNote}
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                              ticket.status === "FEE_CLEARED_APPROVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : ticket.status === "DOUBT_FLAGGED"
                                ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                                : ticket.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-50 text-blue-800 border border-blue-200"
                            }`}>
                              {ticket.status === "FEE_CLEARED_APPROVED" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : null}
                              {ticket.status === "DOUBT_FLAGGED" ? <HelpCircle className="h-3.5 w-3.5 text-amber-600" /> : null}
                              {ticket.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleApprovePayment(ticket.id)}
                                title="Approve & Clear Fee"
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 shadow-xs ${
                                  ticket.status === "FEE_CLEARED_APPROVED"
                                    ? "bg-emerald-700 text-white opacity-80"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                }`}
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => handleDoubtPayment(ticket.id)}
                                title="Flag UTR Doubt / Inquiry Discrepancy"
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs flex items-center gap-1"
                              >
                                <HelpCircle className="h-3.5 w-3.5" />
                                <span>Doubt</span>
                              </button>

                              <button
                                onClick={() => handleRejectPayment(ticket.id)}
                                title="Reject Transaction"
                                className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW: TIME-LOCKED ENCRYPTED PAPER VAULT */}
            {activeTab === "paper_vault" && (isTeacher || isAdmin) && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <KeyRound className="h-5 w-5 text-purple-700" />
                      <span>Time-Locked Encrypted Question Paper Vault</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isTeacher
                        ? `Restricted to assigned faculty subject: ${currentUser.assignedSubject || "CSE-501"}`
                        : "Admin COE Vault Management: Each paper is sealed with an independent passkey."
                      }
                    </p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => setIsPaperUploadModalOpen(true)}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Upload Question Paper Package</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleVaultPapers.map((paper) => {
                    const currentEnteredPass = vaultPasswords[paper.id] || "";

                    return (
                      <div key={paper.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="font-mono font-bold text-blue-700 text-sm">{paper.subjectCode}</span>
                          <div className="flex items-center gap-2">
                            <span className={`p-1.5 rounded ${paper.isUnlocked ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                              {paper.isUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeletePaperVaultItem(paper.id)}
                                title="Delete Package from Vault"
                                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-sm text-slate-900">{paper.subjectName}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Faculty: {paper.assignedFaculty} · {paper.examDate} ({paper.examTime})</div>
                          {paper.fileName && (
                            <div className="text-[10px] text-purple-700 font-mono mt-1 flex items-center gap-1">
                              <HardDrive className="h-3 w-3" /> {paper.fileName}
                            </div>
                          )}
                        </div>

                        <div className="font-mono text-[10px] text-slate-500 bg-slate-50 p-2 rounded border">
                          SHA256-SEAL: {paper.sha256Seal}
                        </div>

                        {paper.isUnlocked ? (
                          <button
                            onClick={() => alert(`Downloading decrypted official paper: ${paper.fileName || `${paper.subjectCode}.pdf`}`)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download Decrypted Question Paper (PDF)</span>
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="password"
                              placeholder={`Passkey for ${paper.subjectCode}`}
                              value={currentEnteredPass}
                              onChange={(e) => {
                                const val = e.target.value;
                                setVaultPasswords(prev => ({ ...prev, [paper.id]: val }));
                              }}
                              className="border p-2 rounded-lg flex-1 outline-none font-mono text-xs focus:border-purple-600 bg-slate-50/50"
                            />
                            <button
                              onClick={() => handleDecryptSinglePaper(paper.id)}
                              className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
                            >
                              Decrypt
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW: EXAM SESSIONS MASTER */}
            {activeTab === "sessions" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Active Examination Schedules</h2>
                    <p className="text-xs text-slate-500">Manage university examination cycles, enrollment windows, status toggles, and enrolled student directories.</p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setEditingSchedule(null);
                        setNewDepartment("B.Tech. CSE (Cyber Security)");
                        setNewSession("Dec - 2026");
                        setNewSemester("5th Semester");
                        setNewExamCentre("LTSU Main Block-B");
                        setIsCreateModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Upload New Exam Session</span>
                    </button>
                  )}
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b font-bold uppercase text-[11px] text-slate-600">
                      <tr>
                        <th className="p-3.5">SL.NO</th>
                        <th className="p-3.5">DEPARTMENT</th>
                        <th className="p-3.5">SESSION</th>
                        <th className="p-3.5">SEMESTER</th>
                        {!isStudent && <th className="p-3.5">ENROLLED CANDIDATES</th>}
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">ACTIONS & CONTROLS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {schedules.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold">{idx + 1}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{s.department}</div>
                            <div className="text-[10px] text-slate-500">{s.program} · {s.examCentre}</div>
                          </td>
                          <td className="p-3.5 font-bold text-slate-900">{s.session}</td>
                          <td className="p-3.5 font-medium">{s.semester}</td>
                          
                          {!isStudent && (
                            <td className="p-3.5">
                              {isAdmin ? (
                                <button
                                  onClick={() => setViewingEnrolledSchedule(s)}
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Users className="h-3.5 w-3.5 text-blue-700" />
                                  <span>{s.enrolledStudents?.length || 0} Students Enrolled</span>
                                </button>
                              ) : isTeacher ? (
                                s.department.toLowerCase().includes("cyber security") || s.department === currentUser?.department ? (
                                  <button
                                    onClick={() => setViewingEnrolledSchedule(s)}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Users className="h-3.5 w-3.5 text-emerald-700" />
                                    <span>{s.enrolledStudents?.length || 0} My Section Students</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">Other Department</span>
                                )
                              ) : null}
                            </td>
                          )}

                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              s.status === "Open" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                            }`}>
                              {s.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            {isStudent && (
                              <button
                                onClick={() => {
                                  if (s.status === "Closed") {
                                    alert("This examination cycle enrollment is CLOSED by Controller of Examinations.");
                                    return;
                                  }
                                  const already = s.enrolledStudents.some(st => st.rollNo === currentRoll);
                                  if (!already) {
                                    s.enrolledStudents.push({
                                      rollNo: currentRoll,
                                      studentName: currentUser?.name || "Student",
                                      program: "UG (B.Tech)",
                                      department: s.department,
                                      enrolledDate: "01/09/2026"
                                    });
                                  }
                                  setSchedules(schedules.map(x => x.id === s.id ? { ...x, isEnrolled: true } : x));
                                  alert("Enrolled successfully in examination cycle!");
                                }}
                                disabled={s.status === "Closed"}
                                className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer ${
                                  s.status === "Closed"
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : s.isEnrolled
                                    ? "bg-emerald-600 text-white"
                                    : "bg-blue-700 text-white"
                                }`}
                              >
                                {s.isEnrolled ? "Enrolled" : s.status === "Closed" ? "Closed" : "Enroll Now"}
                              </button>
                            )}

                            {isAdmin && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    const nextStatus = s.status === "Open" ? "Closed" : "Open";
                                    setSchedules(schedules.map(x => x.id === s.id ? { ...x, status: nextStatus as any } : x));
                                    alert(`Session status changed to ${nextStatus}!`);
                                  }}
                                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer flex items-center gap-1 ${
                                    s.status === "Open"
                                      ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                                      : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                                  }`}
                                >
                                  {s.status === "Open" ? <Ban className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                  <span>{s.status === "Open" ? "Close Session" : "Re-Open"}</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingSchedule(s);
                                    setNewDepartment(s.department);
                                    setNewSession(s.session);
                                    setNewSemester(s.semester);
                                    setNewExamCentre(s.examCentre);
                                    setIsCreateModalOpen(true);
                                  }}
                                  className="rounded border bg-slate-50 p-1.5 text-slate-700 hover:bg-slate-100 cursor-pointer"
                                  title="Edit Session"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (!confirm("Are you sure you want to delete this examination cycle?")) return;
                                    setSchedules(schedules.filter(x => x.id !== s.id));
                                  }}
                                  className="rounded border bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100 cursor-pointer"
                                  title="Delete Session"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW: ENROLLED CANDIDATES DIRECTORY MODAL */}
            {viewingEnrolledSchedule && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
                <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Enrolled Candidates Directory: {viewingEnrolledSchedule.session}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {viewingEnrolledSchedule.department} ({viewingEnrolledSchedule.semester})
                      </p>
                    </div>
                    <button
                      onClick={() => setViewingEnrolledSchedule(null)}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b font-bold uppercase text-[10px] text-slate-600">
                        <tr>
                          <th className="p-3">SL.NO</th>
                          <th className="p-3">STUDENT NAME</th>
                          <th className="p-3">ROLL NUMBER</th>
                          <th className="p-3">PROGRAM</th>
                          <th className="p-3 text-right">ENROLLMENT DATE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-700">
                        {viewingEnrolledSchedule.enrolledStudents.map((st, i) => (
                          <tr key={st.rollNo} className="hover:bg-slate-50">
                            <td className="p-3 font-bold">{i + 1}</td>
                            <td className="p-3 font-semibold text-slate-900">{st.studentName}</td>
                            <td className="p-3 font-mono font-bold text-blue-700">{st.rollNo}</td>
                            <td className="p-3">{st.program}</td>
                            <td className="p-3 text-right text-slate-500">{st.enrolledDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: RESULT UPLOADING ENGINE */}
            {activeTab === "results_hub" && (isTeacher || isAdmin) && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Faculty Result Uploading & Bulk Ledger Ingestion</h2>
                  <p className="text-xs text-slate-500">Upload CSV / Excel marks from computer or drive. Scores immediately calculate SGPA and sync to student marksheets.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      Format: RollNo,SubjectCode,SubjectName,Internal(50),External(50),Credits
                    </span>

                    <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg cursor-pointer border flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-blue-700" />
                      <span>Choose File from Computer / Drive</span>
                      <input
                        type="file"
                        accept=".csv, .txt, .xlsx, .xls"
                        className="hidden"
                        onChange={(e) => handleFileUploadReader(e, (content) => setBulkCsvText(content.trim()))}
                      />
                    </label>
                  </div>

                  <textarea
                    rows={4}
                    value={bulkCsvText}
                    onChange={(e) => setBulkCsvText(e.target.value)}
                    className="w-full p-3 border rounded-xl font-mono text-xs outline-none bg-slate-50"
                  />

                  <button
                    onClick={handleBulkResultUpload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-sm"
                  >
                    Commit Batch Records to Database
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b font-bold uppercase text-slate-600 text-[11px]">
                      <tr><th className="p-3.5">Roll No</th><th className="p-3.5">Subject</th><th className="p-3.5 text-center">Internal</th><th className="p-3.5 text-center">External</th><th className="p-3.5 text-center">Total</th><th className="p-3.5 text-center">Grade</th><th className="p-3.5 text-right">Evaluator</th></tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {marksList.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-blue-700">{m.rollNo}</td>
                          <td className="p-3.5 font-medium">{m.subjectCode} · {m.subjectName}</td>
                          <td className="p-3.5 text-center font-bold">{m.internalMarks}</td>
                          <td className="p-3.5 text-center font-bold">{m.externalMarks}</td>
                          <td className="p-3.5 text-center font-bold text-base">{m.totalMarks}</td>
                          <td className="p-3.5 text-center"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">{m.grade}</span></td>
                          <td className="p-3.5 text-right text-slate-500 font-semibold">{m.evaluatedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW: ADMIN USER APPROVALS DESK */}
            {activeTab === "admin_approvals" && isAdmin && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-indigo-700" />
                      <span>New Registration Verification & Approval Desk</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Review pending Student and Faculty registrations, verify roll numbers / employee codes, and activate portal access.
                    </p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 font-bold text-xs px-3 py-1 rounded-full">
                    {pendingUsers.length} Pending Approval
                  </span>
                </div>

                {pendingUsers.length === 0 ? (
                  <div className="border border-dashed rounded-2xl p-12 text-center text-slate-400 text-xs bg-white space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                    <div className="font-bold text-slate-700 text-sm">All Registration Queues Cleared</div>
                    <p>There are no pending student or faculty registrations awaiting approval.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b font-bold uppercase text-slate-600 text-[11px]">
                        <tr>
                          <th className="p-3.5">CANDIDATE NAME</th>
                          <th className="p-3.5">ROLE CATEGORY</th>
                          <th className="p-3.5">ASSIGNED ID / ROLL</th>
                          <th className="p-3.5">OFFICIAL EMAIL</th>
                          <th className="p-3.5">DEPARTMENT / SUBJECT</th>
                          <th className="p-3.5 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-700">
                        {pendingUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.role === "student" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-blue-700">
                              {u.rollNo || u.employeeId || "N/A"}
                            </td>
                            <td className="p-3.5">{u.email}</td>
                            <td className="p-3.5">
                              <div>{u.department}</div>
                              {u.assignedSubject && (
                                <div className="text-[10px] text-purple-700 font-semibold">{u.assignedSubject}</div>
                              )}
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => handleApproveUserAccount(u.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectUserAccount(u.id)}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: OPTICAL QR GATE SCANNER */}
            {activeTab === "qr_scanner" && (isTeacher || isAdmin) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><ScanLine className="h-5 w-5 text-blue-700" /><span>Live Optical QR Scanner</span></h2>
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950 flex flex-col items-center justify-center border-2 border-slate-800">
                      <video ref={videoRef} className={`h-full w-full object-cover ${isCameraActive ? "block" : "hidden"}`} />
                      <canvas ref={canvasRef} className="hidden" />
                      {!isCameraActive ? (
                        <div className="text-center p-6 space-y-3">
                          <CameraOff className="h-8 w-8 text-slate-500 mx-auto" />
                          <button onClick={startCameraScanner} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 mx-auto cursor-pointer shadow-md"><Camera className="h-4 w-4" /> Start Camera Scanner</button>
                        </div>
                      ) : (
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                          <div className="h-48 w-48 border-2 border-dashed border-emerald-400 rounded-2xl animate-pulse" />
                        </div>
                      )}
                    </div>
                    {isCameraActive && <button onClick={stopCameraScanner} className="w-full py-2 bg-rose-100 text-rose-800 font-bold rounded-lg text-xs cursor-pointer">Stop Camera</button>}
                    <div className="flex gap-2 pt-2">
                      <input type="text" placeholder="e.g. LTSU-PASS-24100030033-9A82" value={scanManualInput} onChange={(e) => setScanManualInput(e.target.value)} className="border p-2.5 rounded-lg flex-1 font-mono text-xs" />
                      <button onClick={() => verifyScannedToken(scanManualInput)} disabled={scanLoading} className="bg-slate-900 text-white font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer">{scanLoading ? "Verifying..." : "Verify"}</button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs min-h-[380px] text-xs">
                    <h3 className="text-base font-bold text-slate-900 border-b pb-3 mb-4">Gate Clearance Record</h3>
                    {scanError && <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg font-bold mb-3">{scanError}</div>}
                    {scannedResult ? (
                      <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
                        <div><span className="text-slate-400 block font-semibold">Candidate:</span><b className="text-sm">{scannedResult.studentName}</b></div>
                        <div><span className="text-slate-400 block font-semibold">Roll Number:</span><b className="text-sm font-mono text-blue-700">{scannedResult.rollNo}</b></div>
                        <div><span className="text-slate-400 block font-semibold">Location:</span><b>{scannedResult.hallNumber} ({scannedResult.deskNumber})</b></div>
                        <div className="text-emerald-700 font-bold text-xs pt-1">STATUS: {scannedResult.status}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-slate-400 border border-dashed rounded-xl">Ready for optical QR scan.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: UMC INCIDENT REGISTRY */}
            {activeTab === "umc_region" && (isTeacher || isAdmin) && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div><h2 className="text-xl font-bold text-slate-900">UMC Incident Desk & Malpractice Registry</h2></div>
                  <button onClick={() => setIsUmcModalOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <ShieldAlert className="h-4 w-4" /><span>Log Malpractice Ticket</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {umcList.map((umc) => (
                    <div key={umc.id} className="rounded-2xl border border-rose-200 bg-white p-5 shadow-xs space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-mono font-bold text-rose-700 text-sm">{umc.ticketNo} · {umc.incidentType}</span>
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">Status: {umc.penaltyStatus}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div><span className="text-slate-400 block font-semibold">Candidate:</span><b>{umc.studentName}</b> (<span className="font-mono text-blue-700">{umc.rollNo}</span>)</div>
                        <div><span className="text-slate-400 block font-semibold">Location:</span>{umc.examHall} ({umc.deskNo})</div>
                        <div><span className="text-slate-400 block font-semibold">Reported By:</span>{umc.reportedBy}</div>
                      </div>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded border italic">"{umc.description}"</p>
                    </div>
                  ))}
                </div>

                {isUmcModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b pb-3"><h3 className="text-base font-bold text-rose-800">Log Malpractice Incident</h3><button onClick={() => setIsUmcModalOpen(false)}><X className="h-5 w-5" /></button></div>
                      <div><label className="block font-bold mb-1">Student Roll Number</label><input required value={umcRoll} onChange={(e) => setUmcRoll(e.target.value)} className="w-full p-2 border rounded font-mono font-bold text-blue-800" /></div>
                      <div><label className="block font-bold mb-1">Student Legal Name</label><input required value={umcName} onChange={(e) => setUmcName(e.target.value)} className="w-full p-2 border rounded" /></div>
                      <div><label className="block font-bold mb-1">Incident Type</label><select value={umcType} onChange={(e) => setUmcType(e.target.value)} className="w-full p-2 border rounded"><option value="Electronic Device/Mobile">Electronic Device/Mobile</option><option value="Chits/Paper">Chits/Paper</option><option value="Impersonation">Impersonation</option></select></div>
                      <div><label className="block font-bold mb-1">Evidence Description</label><textarea rows={3} required value={umcDesc} onChange={(e) => setUmcDesc(e.target.value)} className="w-full p-2 border rounded" /></div>
                      <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setIsUmcModalOpen(false)} className="flex-1 py-2 border rounded font-bold">Cancel</button>
                        <button type="button" onClick={() => {
                          setUmcList([{ id: `umc-${Date.now()}`, ticketNo: `UMC-2026-${Math.floor(100+Math.random()*900)}`, studentName: umcName, rollNo: umcRoll, subjectCode: umcSubCode, examHall: "Hall B-201", deskNo: umcDesk, reportedBy: currentUser?.name || "Invigilator", incidentType: umcType, description: umcDesc, penaltyStatus: "UNDER_INQUIRY" }, ...umcList]);
                          setIsUmcModalOpen(false);
                          alert("UMC Case logged! Student notified in examination module.");
                        }} className="flex-1 bg-rose-600 text-white font-bold py-2 rounded">Commit Malpractice</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL: DIRECT SEATING ARRANGEMENT UPLOADER FROM COMPUTER/DRIVE */}
      {isSeatingUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-purple-700" />
                  <span>Upload Classroom Seating Arrangement Matrix</span>
                </h3>
                <p className="text-slate-500 text-[11px]">Upload CSV / Excel layout file directly from computer or drive.</p>
              </div>
              <button onClick={() => setIsSeatingUploadModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700">Select Target Classroom / Hall</label>
              <select
                value={seatingUploadTargetHall}
                onChange={(e) => setSeatingUploadTargetHall(e.target.value)}
                className="w-full border p-2.5 rounded-xl font-bold bg-slate-50 outline-none"
              >
                {classroomsMeta.map(c => (
                  <option key={c.hallNumber} value={c.hallNumber}>{c.hallNumber} ({c.block})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">CSV Seating Matrix (DeskNo,StudentName,RollNo,SubjectCode)</span>
                <label className="text-purple-700 hover:text-purple-900 font-bold cursor-pointer flex items-center gap-1">
                  <Upload className="h-3 w-3" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".csv, .txt"
                    className="hidden"
                    onChange={(e) => handleFileUploadReader(e, (content) => setSeatingUploadCsvText(content.trim()))}
                  />
                </label>
              </div>
              <textarea
                rows={5}
                value={seatingUploadCsvText}
                onChange={(e) => setSeatingUploadCsvText(e.target.value)}
                className="w-full border p-2.5 rounded-xl font-mono text-xs outline-none bg-slate-50"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsSeatingUploadModalOpen(false)}
                className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleImportSeatingCSV(seatingUploadTargetHall, seatingUploadCsvText);
                  setIsSeatingUploadModalOpen(false);
                }}
                className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                Commit Seating to {seatingUploadTargetHall}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT EXAM SESSION */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingSchedule ? "Edit Examination Cycle" : "Upload New Examination Session"}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingSchedule) {
                setSchedules(schedules.map(s => s.id === editingSchedule.id ? {
                  ...s,
                  department: newDepartment,
                  session: newSession,
                  semester: newSemester,
                  examCentre: newExamCentre,
                } : s));
              } else {
                setSchedules([{
                  id: `exam-${Date.now()}`,
                  program: "UG",
                  department: newDepartment,
                  session: newSession,
                  semester: newSemester,
                  examCentre: newExamCentre,
                  status: "Open",
                  isEnrolled: false,
                  enrolledStudents: []
                }, ...schedules]);
              }
              setIsCreateModalOpen(false);
            }} className="space-y-3 text-xs">
              <div><label className="block font-bold mb-1">Department</label><input required value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} className="w-full border rounded-lg p-2" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block font-bold mb-1">Session Name</label><input required value={newSession} onChange={(e) => setNewSession(e.target.value)} className="w-full border rounded-lg p-2" /></div>
                <div><label className="block font-bold mb-1">Semester</label><input required value={newSemester} onChange={(e) => setNewSemester(e.target.value)} className="w-full border rounded-lg p-2" /></div>
              </div>
              <div><label className="block font-bold mb-1">Exam Centre</label><input required value={newExamCentre} onChange={(e) => setNewExamCentre(e.target.value)} className="w-full border rounded-lg p-2" /></div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-2 border rounded-lg font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-700 text-white font-bold py-2 rounded-lg">{editingSchedule ? "Save Changes" : "Broadcast Session"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC UPI QR PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-purple-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-purple-700" /><span>Official LTSU Fee Payment Gateway</span></h3>
                <p className="text-[11px] text-slate-500">{petitionType === "rechecking" ? "Paper Re-checking Service" : "Re-Examination Session Fee"}</p>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-dashed rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-700">Scan QR Code via Google Pay / PhonePe / Paytm / UPI</span>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=ltsu.exam@sbi&pn=LamrinTechSkillsUniversity&am=${petitionType === "rechecking" ? "500" : "1500"}&cu=INR&tn=${recheckSubCode}_${currentRoll}`)}`} alt="UPI QR" className="h-40 w-40 object-contain p-2 bg-white rounded-xl border" />
              <div className="font-mono text-[10px] text-slate-500">UPI ID: <b>ltsu.exam@sbi</b></div>
            </div>
            <div>
              <label className="block font-bold mb-1">Enter 12-Digit Bank Transaction Ref / UTR:</label>
              <input type="text" placeholder="e.g. 429810298311" value={transactionInput} onChange={(e) => setTransactionInput(e.target.value)} className="w-full p-2.5 border rounded-xl font-mono font-bold text-blue-800 outline-none" />
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-2.5 border rounded-xl font-bold">Cancel</button>
              <button type="button" onClick={() => {
                if (!transactionInput.trim()) { alert("Please enter UTR."); return; }
                setRecheckTickets([{ id: `rev-${Date.now()}`, ticketNo: `REV-2026-${Math.floor(1000+Math.random()*9000)}`, type: petitionType, studentName: currentUser?.name || "Student", rollNo: currentRoll, subjectCode: recheckSubCode, subjectName: "Core Subject", originalMarks: 89, originalGrade: "A+", currentSgpa: sgpa, location: "LTSU Main Block-B", reason: recheckReason, amount: petitionType === "rechecking" ? 500 : 1500, transactionId: transactionInput.trim(), status: "PENDING_FEE_VERIFICATION", appliedDate: "01/09/2026" }, ...recheckTickets]);
                setIsPaymentModalOpen(false);
                setRecheckReason("");
                alert("Payment UTR submitted! Awaiting Admin/COE approval.");
              }} className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl shadow-md">Submit for Admin Approval</button>
            </div>
          </div>
        </div>
      )}

      {/* PAPER VAULT UPLOAD MODAL */}
      {isPaperUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Upload & Encrypt Question Paper Package</h3>
              <button onClick={() => setIsPaperUploadModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div>
              <label className="block font-bold mb-1">Subject Code</label>
              <input required value={newPaperCode} onChange={(e) => setNewPaperCode(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Subject Title</label>
              <input required value={newPaperName} onChange={(e) => setNewPaperName(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Set Unique Decryption Passkey (e.g. 7721)</label>
              <input required value={newPaperPass} onChange={(e) => setNewPaperPass(e.target.value)} className="w-full border p-2 rounded font-mono font-bold" />
            </div>
            <div>
              <label className="block font-bold mb-1">Attach Paper PDF (Computer / Drive)</label>
              <input
                type="file"
                accept=".pdf, .docx, .zip"
                onChange={(e) => setNewPaperUploadedFileName(e.target.files?.[0]?.name || "Paper_Sealed.pdf")}
                className="w-full border p-1.5 rounded bg-slate-50 text-xs"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsPaperUploadModalOpen(false)} className="flex-1 py-2 border rounded font-bold">Cancel</button>
              <button type="button" onClick={() => {
                const newId = `pv-${Date.now()}`;
                setPaperVaultList([{
                  id: newId,
                  subjectCode: newPaperCode,
                  subjectName: newPaperName,
                  assignedFaculty: currentUser?.name || "Dr. H.S. Bains",
                  examDate: "24/12/2026",
                  examTime: "09:30 AM",
                  sha256Seal: `sha256-${Math.random().toString(36).substring(2)}${Date.now()}`,
                  vaultPassword: newPaperPass,
                  isUnlocked: false,
                  fileName: newPaperUploadedFileName || `${newPaperCode}_Official_Sealed.pdf`
                }, ...paperVaultList]);
                setIsPaperUploadModalOpen(false);
                alert(`Question paper for ${newPaperCode} sealed with passkey: ${newPaperPass}`);
              }} className="flex-1 bg-purple-700 text-white font-bold py-2 rounded">Seal & Encrypt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}