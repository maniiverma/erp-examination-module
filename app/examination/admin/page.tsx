"use client";

import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Check, 
  X, 
  BarChart3, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  CreditCard
} from "lucide-react";
import { useExamRBAC } from "../context";

export default function COEAdminPage() {
  const { role, toggleDeclareResults, addSchedule, tickets, resolveTicket } = useExamRBAC();
  const [declareSuccess, setDeclareSuccess] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [graceApplied, setGraceApplied] = useState(false);

  // Database Petitions State
  const [petitions, setPetitions] = useState<any[]>([]);
  const [loadingPetitions, setLoadingPetitions] = useState(true);

  // Form State
  const [program, setProgram] = useState("UG");
  const [session, setSession] = useState("Dec - 2026");
  const [department, setDepartment] = useState("B.Tech. CSE (Cyber Security)");
  const [centre, setCentre] = useState("LTSU Main Campus");

  // Fetch pending fee petitions from Database with cache disabled
  const fetchPetitions = async (showLoading = true) => {
    if (showLoading) setLoadingPetitions(true);
    try {
      // Direct fetch with cache: "no-store" guarantees fresh data on localhost
      const res = await fetch("/api/examination/rechecking", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setPetitions(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin desk data:", err);
    } finally {
      if (showLoading) setLoadingPetitions(false);
    }
  };

  // Real-time Auto-Polling (Runs initial fetch + re-checks every 5 seconds)
  useEffect(() => {
    if (role === "admin") {
      fetchPetitions(true);

      const interval = setInterval(() => {
        fetchPetitions(false);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [role]);

  // Handle Petition Approval via API / Context
  const handleApprovePetition = async (id: string) => {
    try {
      setPetitions((prev) => prev.filter((p) => p.id !== id));
      resolveTicket(id, "Marks Revised");
    } catch (err) {
      console.error("Failed to approve petition:", err);
    }
  };

  // Handle Petition Rejection
  const handleRejectPetition = async (id: string) => {
    try {
      setPetitions((prev) => prev.filter((p) => p.id !== id));
      resolveTicket(id, "Rejected");
    } catch (err) {
      console.error("Failed to reject petition:", err);
    }
  };

  if (role !== "admin") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center max-w-xl mx-auto">
        <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rose-900">Access Restricted (Admin Only)</h3>
        <p className="text-xs text-rose-700 mt-1">
          Only the <b>Controller of Examinations (COE)</b> has access to results declaration and analytics.
        </p>
      </div>
    );
  }

  const handleDeclare = () => {
    toggleDeclareResults();
    setDeclareSuccess(true);
    setTimeout(() => setDeclareSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Batch Performance & Analytics Dashboard */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">COE Batch Performance & Bell-Curve Analytics</h3>
              <p className="text-xs text-slate-500">Real-time statistics for Dec 2026 End-Semester Cycle</p>
            </div>
          </div>
          <button
            onClick={() => setGraceApplied(!graceApplied)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              graceApplied ? "bg-amber-500 text-white" : "border border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> {graceApplied ? "Grace Marks (+2) Active" : "Apply +2 Moderation Curve"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-4">
          <div className="border p-3.5 rounded-lg bg-slate-50">
            <span className="text-slate-500 block">Batch Pass Rate:</span>
            <span className="font-bold text-emerald-700 text-base">{graceApplied ? "94.2%" : "88.5%"}</span>
          </div>
          <div className="border p-3.5 rounded-lg bg-slate-50">
            <span className="text-slate-500 block">Class Average:</span>
            <span className="font-bold text-slate-900 text-base">{graceApplied ? "80.4 / 100" : "78.4 / 100"}</span>
          </div>
          <div className="border p-3.5 rounded-lg bg-slate-50">
            <span className="text-slate-500 block">Total Evaluated:</span>
            <span className="font-bold text-blue-700 text-base">42 Candidates</span>
          </div>
          <div className="border p-3.5 rounded-lg bg-slate-50">
            <span className="text-slate-500 block">UMC Malpractice:</span>
            <span className="font-bold text-rose-600 text-base">1 Case Registered</span>
          </div>
        </div>
      </div>

      {/* 2. Database Live Fee Clearance Desk */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Fee Clearance & Transaction Verification Desk ({petitions.length} Pending)
              </h3>
              <p className="text-xs text-slate-500">
                Verify live student fee submissions & UTR records directly from database.
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchPetitions(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingPetitions ? "animate-spin" : ""}`} /> Refresh Data
          </button>
        </div>

        {loadingPetitions ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />
            Loading pending database petitions...
          </div>
        ) : petitions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed">
            No pending fee petitions in database.
          </div>
        ) : (
          <div className="space-y-3">
            {petitions.map((item: any) => (
              <div
                key={item.id}
                className="border p-4 rounded-xl flex items-center justify-between bg-slate-50 text-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-800">{item.id}</span>
                    <span className="font-bold text-slate-900">{item.studentRoll}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Subject: <b>{item.subjectCode}</b> · Amount: <b>₹{item.amount}</b>
                  </p>
                  <p className="text-[11px] font-mono font-semibold text-purple-700 mt-1">
                    UTR / Ref: {item.transactionId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprovePetition(item.id)}
                    className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-emerald-700 flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleRejectPetition(item.id)}
                    className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-rose-200 flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Results Moderation & Release */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Controller of Examinations — Release Console</h3>
            <p className="text-xs text-slate-500">Publish semester scores and grade transcripts directly to student portals.</p>
          </div>
          <button
            onClick={handleDeclare}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-xs transition-all"
          >
            Publish & Declare All Results
          </button>
        </div>

        {declareSuccess && (
          <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-bold">
            <CheckCircle2 className="h-4 w-4" /> All examination scores locked and declared to student marksheets!
          </div>
        )}

        <div className="p-4 bg-slate-50 border rounded-lg text-xs space-y-2">
          <div className="flex justify-between"><span>CSE-501 Advanced Cryptography:</span> <span className="font-bold text-emerald-700">Moderated & Declared</span></div>
          <div className="flex justify-between"><span>CSE-502 Ethical Hacking:</span> <span className="font-bold text-emerald-700">Moderated & Declared</span></div>
          <div className="flex justify-between"><span>CSE-503 Cloud Security:</span> <span className="font-bold text-emerald-700">Moderated & Declared</span></div>
        </div>
      </div>

      {/* 4. Student Re-evaluation Appeals Board (Local Context Tickets) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Student Re-evaluation Appeals Board</h3>
        <p className="text-xs text-slate-500 mb-4">Review and decide on student paper re-checking petitions.</p>
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
              No context tickets pending.
            </div>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="border p-4 rounded-lg bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-blue-800">{t.id}</span> · <span className="font-bold text-slate-800">{t.subjectCode}</span>
                  <p className="text-slate-600 text-[11px] mt-1">"{t.reason}"</p>
                  <span className="text-[10px] text-amber-700 font-bold">Current Status: {t.status}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => resolveTicket(t.id, "Marks Revised")}
                    className="bg-emerald-600 text-white px-3 py-1.5 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve & Revise
                  </button>
                  <button
                    onClick={() => resolveTicket(t.id, "Rejected")}
                    className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}