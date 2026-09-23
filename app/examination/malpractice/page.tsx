"use client";

import React, { useState } from "react";
import { AlertOctagon, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useExamRBAC } from "../context";

export default function MalpracticePage() {
  const { role, malpracticeLogs, addMalpracticeLog } = useExamRBAC();
  const [rollNo, setRollNo] = useState("");
  const [subjectCode, setSubjectCode] = useState("CSE-502");
  const [hallNo, setHallNo] = useState("Hall B-201");
  const [incidentType, setIncidentType] = useState("Unauthorized Paper Notes / Chits");
  const [evidence, setEvidence] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (role === "student") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center max-w-xl mx-auto">
        <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rose-900">Access Restricted</h3>
        <p className="text-xs text-rose-700 mt-1">
          Only invigilation supervisors and COE authorities have access to the Malpractice Registry.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || !evidence.trim()) return;

    // Corrected to pass parameters matching addMalpracticeLog(studentRoll, subjectCode, reason)
    const formattedReason = `[${hallNo}] ${incidentType}: ${evidence.trim()}`;
    addMalpracticeLog(rollNo.trim(), subjectCode, formattedReason);

    setRollNo("");
    setEvidence("");
    setSuccessMsg("UMC case registered and forwarded to the Central Disciplinary Committee.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertOctagon className="h-5 w-5 text-rose-600" /> Flying Squad & Invigilator UMC Registry
        </h2>
        <p className="text-xs text-slate-500">
          Official incident logging for examination malpractice and candidate debarment workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3">Register Unfair Means Case (UMC)</h3>

          {successMsg && (
            <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Roll No</label>
                <input
                  required
                  placeholder="e.g. 24100030089"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hall Number</label>
                <input
                  required
                  value={hallNo}
                  onChange={(e) => setHallNo(e.target.value)}
                  className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              >
                <option value="CSE-501">CSE-501 · Advanced Cryptography & PKI</option>
                <option value="CSE-502">CSE-502 · Ethical Hacking & Penetration Testing</option>
                <option value="CSE-503">CSE-503 · Cloud Security & Zero-Trust Architecture</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              >
                <option value="Unauthorized Paper Notes / Chits">Unauthorized Paper Notes / Chits</option>
                <option value="Smartwatch / Electronic Storage Device">Smartwatch / Electronic Storage Device</option>
                <option value="Candidate Impersonation">Candidate Impersonation</option>
                <option value="Disruptive Conduct in Examination Hall">Disruptive Conduct in Examination Hall</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Evidence & Supervisor Remarks</label>
              <textarea
                rows={3}
                required
                placeholder="State the observed behavior, confiscated material, and supervisor observations..."
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-rose-600 py-2.5 font-bold text-white hover:bg-rose-700 cursor-pointer shadow-sm transition-all"
            >
              Sign & Commit Incident to Ledger
            </button>
          </form>
        </div>

        {/* Live Logs */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3">Live Logged UMC Incident Registry</h3>
          <div className="space-y-3">
            {malpracticeLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-lg">
                No malpractice incidents logged yet.
              </div>
            ) : (
              malpracticeLogs.map((log) => (
                <div key={log.id} className="border border-rose-200 bg-rose-50/50 p-4 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-800">{log.id}</span>
                    <span className="rounded bg-rose-200 text-rose-900 px-2 py-0.5 font-bold text-[10px]">
                      Under Disciplinary Review
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">
                    Roll: {log.studentRoll} ({log.subjectCode})
                  </div>
                  <div className="text-slate-800 font-medium">Student Name: {log.studentName}</div>
                  <p className="text-slate-600 text-[11px] italic">"{log.reason}"</p>
                  <div className="flex justify-between items-center pt-2 border-t text-[10px] text-slate-500">
                    <span>Reported By: {log.reportedBy}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}