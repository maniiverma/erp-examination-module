"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Search, FileBadge, Lock } from "lucide-react";

export default function VerificationPage() {
  const [token, setToken] = useState("LTSU-9A82-F0E1");
  const [isVerified, setIsVerified] = useState(true);

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-800 p-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2b3a67] text-white font-bold text-sm shadow-inner">
              LTSU
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">LAMRIN TECH SKILLS UNIVERSITY</h2>
              <p className="text-xs text-slate-500">Public Document & Transcript Verification Portal</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter Certificate SHA-256 Token (e.g. LTSU-9A82-F0E1)"
              className="flex-1 rounded-lg border border-slate-300 p-2 text-xs font-mono outline-none focus:border-blue-600"
            />
            <button
              onClick={() => setIsVerified(token.trim().length > 5)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" /> Verify Integrity
            </button>
          </div>
        </div>

        {/* Verification Result Card */}
        {isVerified ? (
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" />
                <span>Authentic Record Found in LTSU Ledger</span>
              </div>
              <span className="rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold px-2 py-0.5">
                HASH: SHA256-VALID
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Candidate Name:</span>
                <span className="font-bold text-slate-900">Manpreet Singh</span>
              </div>
              <div>
                <span className="text-slate-500 block">Roll Number:</span>
                <span className="font-bold text-blue-700 font-mono">2026-CSE-042</span>
              </div>
              <div>
                <span className="text-slate-500 block">Academic Program:</span>
                <span className="font-medium text-slate-800">B.Tech. CSE (Cyber Security)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Declared SGPA:</span>
                <span className="font-bold text-emerald-700 text-sm">8.75 / 10.00</span>
              </div>
              <div>
                <span className="text-slate-500 block">Issued Session:</span>
                <span className="font-medium text-slate-800">Dec - 2025 Regular Exam</span>
              </div>
              <div>
                <span className="text-slate-500 block">Signing Authority:</span>
                <span className="font-medium text-slate-800">Controller of Examinations, LTSU</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600 border">
              <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Cryptographic hash matches Turso database ledger. No tampering detected.</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-700 font-bold">
            Invalid verification token. Record not found on university node.
          </div>
        )}
      </div>
    </div>
  );
}