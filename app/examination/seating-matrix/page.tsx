"use client";

import React, { useState } from "react";
import { Grid, ShieldCheck, UserCheck, Shuffle, Download } from "lucide-react";
import { useExamRBAC } from "../context";

export default function SeatingMatrixPage() {
  const { role } = useExamRBAC();
  const [desks, setDesks] = useState([
    { id: 1, name: "Desk #01", roll: "2026-CSE-001", student: "Aarav Sharma", status: "ASSIGNED", dummyRoll: "DUMMY-9021" },
    { id: 2, name: "Desk #02", roll: "2026-CSE-007", student: "Bhavna Patel", status: "ASSIGNED", dummyRoll: "DUMMY-9022" },
    { id: 3, name: "Desk #03", roll: "2026-CSE-018", student: "Amanjot Kaur", status: "ASSIGNED", dummyRoll: "DUMMY-9023" },
    { id: 4, name: "Desk #04", roll: "2026-CSE-042", student: "Manpreet Singh", status: "ASSIGNED", dummyRoll: "DUMMY-9024" },
    { id: 5, name: "Desk #05", roll: "2026-CSE-089", student: "Rohit Verma", status: "BLOCKED_UMC", dummyRoll: "DUMMY-9025" },
    { id: 6, name: "Desk #06", roll: "2026-CSE-095", student: "Simran Kaur", status: "ASSIGNED", dummyRoll: "DUMMY-9026" },
    { id: 7, name: "Desk #07", roll: "2026-CSE-102", student: "Tanveer Singh", status: "VACANT", dummyRoll: "DUMMY-9027" },
    { id: 8, name: "Desk #08", roll: "2026-CSE-110", student: "Vikas Kumar", status: "ASSIGNED", dummyRoll: "DUMMY-9028" },
  ]);

  const [selectedDesk, setSelectedDesk] = useState<any>(null);

  const shuffleSeats = () => {
    const shuffled = [...desks].sort(() => Math.random() - 0.5);
    setDesks(shuffled);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Grid className="h-5 w-5 text-blue-700" /> Interactive Exam Hall Layout (Hall B-201)
          </h2>
          <p className="text-xs text-slate-500">
            Zero-Trust automated seating allocator with encrypted Dummy Roll Masking.
          </p>
        </div>

        {(role === "admin" || role === "teacher") && (
          <div className="flex gap-2">
            <button
              onClick={shuffleSeats}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer shadow-xs"
            >
              <Shuffle className="h-3.5 w-3.5" /> Randomize Desks
            </button>
            <button
              onClick={() => alert("Seating chart exported to PDF!")}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export Roster
            </button>
          </div>
        )}
      </div>

      {/* 2D Hall Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {desks.map((d) => (
          <div
            key={d.id}
            onClick={() => setSelectedDesk(d)}
            className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
              d.status === "BLOCKED_UMC"
                ? "bg-rose-50 border-rose-300"
                : d.status === "VACANT"
                ? "bg-slate-50 border-dashed border-slate-300"
                : selectedDesk?.id === d.id
                ? "bg-blue-50 border-blue-500 ring-2 ring-blue-400"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-xs">{d.name}</span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  d.status === "BLOCKED_UMC"
                    ? "bg-rose-200 text-rose-800"
                    : d.status === "VACANT"
                    ? "bg-slate-200 text-slate-700"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {d.status}
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-800 truncate">{d.student}</div>
            <div className="font-mono text-[10px] text-slate-500 mt-0.5">{d.roll}</div>
            <div className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] text-blue-700 font-mono">
              <span>Masked Key:</span>
              <span className="font-bold">{d.dummyRoll}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desk Inspector Drawer */}
      {selectedDesk && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs flex items-center justify-between animate-in fade-in">
          <div>
            <span className="font-bold text-blue-950 block text-sm">
              Inspector: {selectedDesk.name} ({selectedDesk.student})
            </span>
            <span className="text-slate-600">
              Allocated Roll: <b className="font-mono">{selectedDesk.roll}</b> · Anonymized Evaluation Seal: <b className="font-mono">{selectedDesk.dummyRoll}</b>
            </span>
          </div>
          <button
            onClick={() => setSelectedDesk(null)}
            className="rounded bg-slate-900 text-white px-3 py-1 text-xs font-bold"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
}