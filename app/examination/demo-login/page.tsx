"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  UserCheck, 
  GraduationCap, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  KeyRound,
  IdCard
} from "lucide-react";

type DemoRole = "student" | "faculty" | "admin";

interface DemoPreset {
  roleName: DemoRole;
  title: string;
  name: string;
  email: string;
  password: string;
  identifier: string; // Roll No or Employee ID
  department: string;
  badge: string;
  accentColor: string;
  description: string;
}

const DEMO_ACCOUNTS: Record<DemoRole, DemoPreset> = {
  student: {
    roleName: "student",
    title: "Student Candidate",
    name: "Manpreet Singh",
    email: "24100030033@ltsu.ac.in",
    password: "student123",
    identifier: "24100030033",
    department: "B.Tech CSE (Cyber Security)",
    badge: "Roll: 24100030033",
    accentColor: "border-blue-500 bg-blue-50/50 text-blue-800",
    description: "Access Examination Hall Tickets, Official Transcripts, and Re-evaluation Grievances."
  },
  faculty: {
    roleName: "faculty",
    title: "Faculty Evaluator",
    name: "Rohit Nanda",
    email: "teacher@ltsu.ac.in",
    password: "teacher123",
    identifier: "EMP-8921",
    department: "School of Engineering & Technology",
    badge: "Emp ID: EMP-8921",
    accentColor: "border-purple-500 bg-purple-50/50 text-purple-800",
    description: "Submit & lock Internal/External marks, access Question Paper Vault & Hall Seating."
  },
  admin: {
    roleName: "admin",
    title: "COE / Administrator",
    name: "Controller of Examinations",
    email: "admin@ltsu.ac.in",
    password: "admin123",
    identifier: "COE-OFFICE-01",
    department: "Central Examination Branch",
    badge: "Role: Controller of Examinations",
    accentColor: "border-amber-500 bg-amber-50/50 text-amber-800",
    description: "Approve candidate registrations, schedule examination sessions, and publish university results."
  }
};

export default function DemoAuthenticationCenter() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<DemoRole>("student");
  const [email, setEmail] = useState<string>(DEMO_ACCOUNTS.student.email);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS.student.password);
  const [loading, setLoading] = useState<boolean>(false);
  const [seedingDb, setSeedingDb] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Select Preset and Fill Inputs
  const handleSelectPreset = (role: DemoRole) => {
    setSelectedRole(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setPassword(DEMO_ACCOUNTS[role].password);
    setErrorMsg("");
    setSuccessMsg("");
  };

  // Seed All 3 Demo Accounts into Turso/SQLite Database
  const handleSeedDatabase = async () => {
    try {
      setSeedingDb(true);
      setErrorMsg("");
      setSuccessMsg("");
      const res = await fetch("/api/demo/seed", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setSuccessMsg("All 3 demo accounts (Student, Faculty, Admin) successfully seeded and active in Turso Database!");
      } else {
        setErrorMsg(data.error || "Failed to seed demo accounts.");
      }
    } catch (err: any) {
      setErrorMsg("Network error occurred during database seeding.");
    } finally {
      setSeedingDb(false);
    }
  };

  // Login via API and redirect to the real dashboard
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.ok) {
        setSuccessMsg(`Authenticated as ${data.user.name}. Redirecting to dashboard...`);
        setTimeout(() => {
          router.push("/examination");
        }, 800);
      } else {
        // If user is not seeded yet, seed automatically and retry
        if (data.error?.includes("No account found")) {
          setErrorMsg("Account missing in database. Clicking 'Auto-Seed Demo Accounts' below will initialize them.");
        } else {
          setErrorMsg(data.error || "Authentication failed.");
        }
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] py-12 px-4 flex flex-col items-center justify-center font-sans antialiased text-slate-800">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Top Header Box */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#2b3a67] text-white font-bold text-2xl shadow-md mb-2">
            LTSU
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Lamrin Tech Skills University Punjab
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Zero-Trust Role-Based Demo Gateway with Pre-Configured Database Credentials
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Role Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(DEMO_ACCOUNTS) as DemoRole[]).map((roleKey) => {
            const acc = DEMO_ACCOUNTS[roleKey];
            const isSelected = selectedRole === roleKey;
            return (
              <div
                key={roleKey}
                onClick={() => handleSelectPreset(roleKey)}
                className={`rounded-2xl border-2 p-5 cursor-pointer transition-all bg-white shadow-xs hover:shadow-md ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${acc.accentColor}`}>
                    {acc.title}
                  </span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                </div>

                <div className="font-bold text-sm text-slate-900">{acc.name}</div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">{acc.email}</div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID / Roll:</span>
                    <b className="font-mono text-blue-700">{acc.identifier}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Password:</span>
                    <b className="font-mono text-slate-700">{acc.password}</b>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-3 line-clamp-2">
                  {acc.description}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPreset(roleKey);
                  }}
                  className={`w-full mt-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Load Credentials
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Form Submission Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-5 gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sign In with {DEMO_ACCOUNTS[selectedRole].title}
              </h3>
              <p className="text-xs text-slate-500">
                Verifies identity against live Turso database session tables.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleSeedDatabase}
              disabled={seedingDb}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all cursor-pointer disabled:opacity-50"
            >
              {seedingDb ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
              <span>Auto-Seed Demo Accounts to Database</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">University Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl outline-none focus:border-blue-600 font-medium bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl outline-none focus:border-blue-600 font-mono bg-slate-50/50"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2b3a67] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter {DEMO_ACCOUNTS[selectedRole].title} Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="text-center">
          <a
            href="/examination"
            className="text-xs text-slate-500 hover:text-blue-700 font-semibold transition-colors"
          >
            ← Return to Main Examination Portal
          </a>
        </div>
      </div>
    </div>
  );
}