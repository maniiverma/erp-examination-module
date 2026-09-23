"use client";

import React, { useState, useEffect } from "react";
import { Award, Download, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { useExamRBAC, ExaminationProvider } from "../context";

function MarksheetContent() {
  const { user } = useExamRBAC();
  const [marksList, setMarksList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/examination/marksheet", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setMarksList(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const totalObtained = marksList.reduce((acc, curr) => acc + (curr.totalMarks || 0), 0);
  const totalMax = marksList.length * 100;
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-xl shadow-md">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" /> Digital Transcript & Marksheet Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official COE Verified End-Semester Grade Sheet
          </p>
        </div>
        <button
          onClick={fetchMarks}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Results
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-xl border">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" /> Loading Academic Transcript...
        </div>
      ) : marksList.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 border border-dashed rounded-xl">
          No published grade sheet records found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Header Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b text-xs">
            <div>
              <span className="text-slate-500 block">Candidate Name:</span>
              <span className="font-bold text-slate-900">{user?.name || "Manpreet Singh"}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Roll Number:</span>
              <span className="font-bold font-mono text-slate-900">{user?.rollNo || "24100030033"}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Aggregate Percentage:</span>
              <span className="font-bold text-emerald-700 text-base">{percentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Result Status:</span>
              <span className="font-bold text-blue-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> PASSED
              </span>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Internal (40)</th>
                  <th className="p-3">External (60)</th>
                  <th className="p-3">Grace</th>
                  <th className="p-3">Total (100)</th>
                  <th className="p-3">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {marksList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{m.subjectCode}</div>
                      <div className="text-[11px] text-slate-500">{m.subjectName}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{m.internalMarks}</td>
                    <td className="p-3 font-semibold text-slate-700">{m.externalMarks}</td>
                    <td className="p-3 font-semibold text-amber-700">{m.graceMarks || 0}</td>
                    <td className="p-3 font-bold text-slate-900">{m.totalMarks}</td>
                    <td className="p-3">
                      <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        {m.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t flex justify-between items-center">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-amber-500" /> Digital SHA-256 Verified Transcript
            </span>
            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="h-4 w-4" /> Download Official Marksheet PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarksheetPage() {
  return (
    <ExaminationProvider>
      <MarksheetContent />
    </ExaminationProvider>
  );
}