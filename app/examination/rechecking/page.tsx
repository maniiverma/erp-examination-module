"use client";

import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  ShieldAlert,
  Loader2,
} from "lucide-react";

import { useExamRBAC, ExaminationProvider } from "../context";

function RecheckingContent() {
  const { role, user, tickets, addRecheckTicket } = useExamRBAC();

  const [reason, setReason] = useState("");
  const [subCode, setSubCode] = useState("CSE-502");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Faculty access restriction
  if (role === "teacher") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center max-w-xl mx-auto">
        <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rose-900">
          Access Restricted (Zero-Trust RBAC)
        </h3>
        <p className="text-xs text-rose-700 mt-1">
          Faculty cannot submit student grievances. Go to{" "}
          <b>Faculty Terminal</b>.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setErrorMsg("Please enter a grievance reason.");
      return;
    }

    if (!transactionId.trim()) {
      setErrorMsg("Please enter the Bank UTR / Transaction Reference Number.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // 1. Backend API POST Request
      const res = await fetch("/api/examination/rechecking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNo: user?.rollNo || "24100030033",
          subjectCode: subCode,
          amount: 500,
          transactionId: transactionId.trim(),
          reason: reason.trim(),
        }),
      });

      const data = await res.json();

      // 2. Synchronize with React Context for Real-Time RBAC UI Sync
      const ticketId =
        data.data?.id || addRecheckTicket(subCode, reason.trim());

      if (!data.data?.id) {
        // Guarantee context state update if backend returned fallback
        addRecheckTicket(subCode, reason.trim());
      }

      setReason("");
      setTransactionId("");

      setSuccessMsg(
        `Petition submitted successfully! Awaiting Admin clearance. Ticket ID: ${ticketId}`
      );

      setTimeout(() => {
        setSuccessMsg("");
      }, 6000);
    } catch (err) {
      console.error("Rechecking submission error:", err);

      // Fallback context update for offline/local execution
      const ticketId = addRecheckTicket(subCode, reason.trim());

      setReason("");
      setTransactionId("");

      setSuccessMsg(
        `Request saved locally. Tracking Ticket ID: ${ticketId}`
      );

      setTimeout(() => {
        setSuccessMsg("");
      }, 6000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ================= APPLICATION FORM ================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Apply for Paper Re-evaluation
        </h3>

        <p className="text-xs text-slate-500 mb-4">
          Candidate: <b>{user?.name || "Student"}</b>{" "}
          ({user?.rollNo || "N/A"}). Grievances are reviewed by the COE
          board.
        </p>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-semibold">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Subject */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Paper
            </label>

            <select
              value={subCode}
              onChange={(e) => setSubCode(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-slate-100"
            >
              <option value="CSE-501">
                CSE-501 · Advanced Cryptography & PKI
              </option>
              <option value="CSE-502">
                CSE-502 · Ethical Hacking & Penetration Testing
              </option>
              <option value="CSE-503">
                CSE-503 · Cloud Security & Zero-Trust Architecture
              </option>
              <option value="CSE-504">
                CSE-504 · Cyber Forensics & Incident Response
              </option>
            </select>
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Bank UTR / Transaction Reference Number
            </label>

            <input
              type="text"
              required
              placeholder="e.g. 429810298311"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 p-2.5 font-mono outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Grievance Justification / Reason
            </label>

            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              placeholder="State the exact question numbers, recounting issues, or evaluation discrepancies..."
              className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>

          {/* Fee Information */}
          <div className="border p-3 rounded-lg bg-amber-50/60 text-amber-900">
            <span className="font-bold block mb-0.5">
              Re-evaluation Fee: ₹500 per subject
            </span>
            <span className="text-[11px] text-amber-700">
              Auto-submitted with bank transaction reference for clearance.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-600 py-2.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>
              {loading
                ? "Submitting Request..."
                : "Submit Re-evaluation Petition"}
            </span>
          </button>
        </form>
      </div>

      {/* ================= LIVE TICKETS ================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Live Grievance Tracker
        </h3>

        <p className="text-xs text-slate-500 mb-4">
          Official progress on answer sheet re-checking petitions.
        </p>

        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
              <p className="text-xs text-slate-500">
                No re-evaluation petitions submitted yet.
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Your submitted petitions will appear here.
              </p>
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                className="border rounded-lg p-4 bg-slate-50 text-xs"
              >
                {/* Ticket Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-blue-800">
                    {t.id}
                  </span>

                  <span
                    className={`rounded px-2 py-0.5 font-bold text-[10px] ${
                      t.status === "Marks Revised"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.status === "Rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                {/* Subject */}
                <div className="font-semibold text-slate-900">
                  {t.subjectCode} · {t.subjectName}
                </div>

                {/* Reason */}
                <p className="text-slate-600 text-[11px] mt-1 italic">
                  "{t.reason}"
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-3 pt-2 border-t text-[10px] text-slate-500">
                  <span>Applied: {t.appliedDate}</span>
                  <span className="font-medium text-emerald-700">
                    {t.feePaid}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROVIDER WRAPPER
// ============================================================

export default function RecheckingPage() {
  return (
    <ExaminationProvider>
      <RecheckingContent />
    </ExaminationProvider>
  );
}