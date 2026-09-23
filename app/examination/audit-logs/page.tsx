"use client";

import React from "react";
import { ShieldAlert, Activity, FileCheck, Lock } from "lucide-react";
import { useExamRBAC } from "../context";

export default function AuditLogsPage() {
  const { role } = useExamRBAC();

  const auditEvents = [
    {
      id: "LOG-901",
      action: "MARKS_MODIFICATION",
      module: "Module 3: Examination",
      actor: "Rohit Nanda (Teacher)",
      details: "Updated External marks for Roll #2026-CSE-042 in CSE-502 from 42 to 45.",
      ip: "172.20.10.2",
      timestamp: "31/08/2026, 04:12 PM",
    },
    {
      id: "LOG-902",
      action: "PAPER_VAULT_UNLOCK",
      module: "Module 3: Paper Vault",
      actor: "Rohit Nanda (Teacher)",
      details: "Decrypted SHA-256 package for CSE-502 using COE OTP #8921.",
      ip: "172.20.10.2",
      timestamp: "31/08/2026, 03:55 PM",
    },
    {
      id: "LOG-903",
      action: "RESULTS_DECLARED",
      module: "Module 3: Moderation",
      actor: "COE Administrator",
      details: "Published 5th Semester results and signed digital transcripts.",
      ip: "192.168.1.100",
      timestamp: "31/08/2026, 03:30 PM",
    },
    {
      id: "LOG-904",
      action: "UMC_INCIDENT_REGISTERED",
      module: "Module 3: Malpractice",
      actor: "Rohit Nanda (Teacher)",
      details: "Logged unauthorized materials case against Roll #2026-CSE-089.",
      ip: "172.20.10.2",
      timestamp: "31/08/2026, 11:20 AM",
    },
  ];

  if (role === "student") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center max-w-xl mx-auto font-sans">
        <ShieldAlert className="h-12 w-12 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rose-900">Access Restricted (Zero-Trust Security)</h3>
        <p className="text-xs text-rose-700 mt-1">
          Students do not have permission to inspect system audit ledgers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-700" /> Blue Team Zero-Trust Audit Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Immutable trace of all mark edits, vault decryptions, and declaration actions.
          </p>
        </div>
        <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1">
          INTEGRITY SIGNED
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-slate-50 text-[11px] font-bold uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Event ID</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor / Role</th>
              <th className="px-4 py-3">Event Description</th>
              <th className="px-4 py-3">IP Address</th>
              <th className="px-4 py-3 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {auditEvents.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-mono font-bold text-blue-700">{ev.id}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-[10px] text-slate-700">
                    {ev.action}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">{ev.actor}</td>
                <td className="px-4 py-3 text-slate-600 max-w-md">{ev.details}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{ev.ip}</td>
                <td className="px-4 py-3 text-right text-slate-500">{ev.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}