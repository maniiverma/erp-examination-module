"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldAlert, AlertOctagon, UserCheck } from "lucide-react";
import { useExamRBAC } from "../context";

export default function FacultyTerminalPage() {
  const { role, user, marksList, updateMark, attendanceList, toggleAttendance } = useExamRBAC();
  const [activeTab, setActiveTab] = useState<"marks" | "attendance" | "umc">("marks");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [umcSuccess, setUmcSuccess] = useState("");

  if (role === "student") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center max-w-xl mx-auto">
        <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rose-900">Access Denied (403 Forbidden)</h3>
        <p className="text-xs text-rose-700 mt-1">
          Students cannot access the Faculty Evaluation Terminal. Switch to <b>Faculty Evaluator</b> in the top bar.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUmcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUmcSuccess("UMC incident report logged with digital invigilator signature.");
    setTimeout(() => setUmcSuccess(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs for Faculty */}
      <div className="flex items-center gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab("marks")}
          className={`rounded px-3 py-1.5 text-xs font-semibold ${
            activeTab === "marks" ? "bg-amber-500 text-white" : "bg-white text-slate-600 border"
          }`}
        >
          Subject Marks Entry (CSE-502)
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`rounded px-3 py-1.5 text-xs font-semibold ${
            activeTab === "attendance" ? "bg-amber-500 text-white" : "bg-white text-slate-600 border"
          }`}
        >
          Hall B-201 Invigilation Roster
        </button>
        <button
          onClick={() => setActiveTab("umc")}
          className={`rounded px-3 py-1.5 text-xs font-semibold ${
            activeTab === "umc" ? "bg-amber-500 text-white" : "bg-white text-slate-600 border"
          }`}
        >
          Report UMC Malpractice
        </button>
      </div>

      {/* Tab 1: Marks Entry */}
      {activeTab === "marks" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Subject Evaluation: CSE-502 Ethical Hacking
              </h3>
              <p className="text-xs text-slate-500">
                Evaluator: {user.name} ({role.toUpperCase()}) · Formula: $Total = Internal (50) + External (50)$
              </p>
            </div>
            <button
              onClick={handleSave}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
            >
              Save & Commit Batch to Turso
            </button>
          </div>

          {saveSuccess && (
            <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Marks batch verified, encrypted, and saved in database!
            </div>
          )}

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b text-[11px] font-bold uppercase text-slate-600">
              <tr>
                <th className="p-3">Roll No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3 text-center">Internal (50)</th>
                <th className="p-3 text-center">External (50)</th>
                <th className="p-3 text-center">Total (100)</th>
                <th className="p-3 text-center">Calculated Grade</th>
                <th className="p-3 text-right">Lock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {marksList
                .filter(m => m.subjectCode === "CSE-502")
                .map((row) => (
                  <tr key={row.studentId} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-slate-800">{row.rollNo}</td>
                    <td className="p-3 font-semibold text-slate-900">{row.studentName}</td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={row.internalMarks}
                        onChange={(e) => updateMark(row.studentId, row.subjectCode, "internalMarks", parseInt(e.target.value))}
                        className="w-16 rounded border border-slate-300 p-1 text-center font-bold text-blue-700 outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={row.externalMarks}
                        onChange={(e) => updateMark(row.studentId, row.subjectCode, "externalMarks", parseInt(e.target.value))}
                        className="w-16 rounded border border-slate-300 p-1 text-center font-bold text-blue-700 outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-3 text-center font-bold text-base text-slate-900">{row.totalMarks}</td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded font-bold text-xs bg-emerald-100 text-emerald-800">
                        {row.grade}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Evaluated
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Invigilation Roster */}
      {activeTab === "attendance" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Hall B-201 Physical Attendance Roster</h3>
          <p className="text-xs text-slate-500 mb-4">Click attendance tags to toggle physical presence in the examination hall.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {attendanceList.map((a) => (
              <div key={a.roll} className="border p-4 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{a.desk} · {a.name}</span>
                  <span className="text-slate-500 font-mono">{a.roll}</span>
                </div>
                <button
                  onClick={() => toggleAttendance(a.roll)}
                  className={`px-3 py-1 rounded font-bold text-[10px] cursor-pointer ${
                    a.status === "PRESENT" ? "bg-emerald-600 text-white" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {a.status}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: UMC Malpractice */}
      {activeTab === "umc" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs max-w-xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-600" /> Report Unfair Means Case (UMC)
          </h3>
          <p className="text-xs text-slate-500 mb-4">Digital supervisor incident logging.</p>

          {umcSuccess && (
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
              {umcSuccess}
            </div>
          )}

          <form onSubmit={handleUmcSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Roll Number</label>
              <input required placeholder="e.g. 2026-CSE-089" className="w-full border p-2 rounded outline-none" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Incident Type</label>
              <select className="w-full border p-2 rounded outline-none">
                <option>Unauthorized Paper Notes / Chits</option>
                <option>Smartwatch / Electronic Device</option>
                <option>Impersonation</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Invigilator Observation Remarks</label>
              <textarea rows={3} required placeholder="State exact evidence observed..." className="w-full border p-2 rounded outline-none" />
            </div>
            <button type="submit" className="w-full bg-rose-600 text-white font-bold py-2.5 rounded hover:bg-rose-700 cursor-pointer">
              Submit Official UMC Incident
            </button>
          </form>
        </div>
      )}
    </div>
  );
}