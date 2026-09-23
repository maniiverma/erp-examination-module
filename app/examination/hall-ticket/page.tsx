"use client";

import React, { useState, useEffect } from "react";
import { Download, ShieldCheck, ShieldAlert, RefreshCw, CheckCircle2 } from "lucide-react";
import { useExamRBAC, ExaminationProvider } from "../context";

function HallTicketContent() {
  const { role, user } = useExamRBAC();
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHallTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/examination/hall-ticket", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const studentTicket = data.data.find((t: any) => t.studentRoll === user?.rollNo) || data.data[0];
        setTicketData(studentTicket);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHallTicket();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">End-Semester Hall Ticket Desk</h2>
          <p className="text-xs text-slate-500">Official Admit Card & Seating Desk Verification</p>
        </div>
        <button
          onClick={fetchHallTicket}
          className="flex items-center gap-1.5 border border-slate-300 bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Status
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />
          Loading Hall Ticket Status...
        </div>
      ) : !ticketData ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 border border-dashed rounded-xl">
          No Hall Ticket record found for current session.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Registration / Ticket ID</span>
              <span className="font-mono font-bold text-blue-800 text-sm">{ticketData.id}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                ticketData.status === "RELEASED"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {ticketData.status === "RELEASED" ? "ADMIT CARD RELEASED" : "CLEARANCE PENDING"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Candidate Name:</span>
              <span className="font-bold text-slate-900">{ticketData.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Roll Number:</span>
              <span className="font-bold font-mono text-slate-900">{ticketData.studentRoll}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Examination Center:</span>
              <span className="font-bold text-slate-900">{ticketData.examCenter}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Session:</span>
              <span className="font-bold text-slate-900">{ticketData.session}</span>
            </div>
          </div>

          {ticketData.status === "RELEASED" ? (
            <div className="pt-4 border-t flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Approved by {ticketData.approvedBy}
              </span>
              <button
                onClick={() => window.print()}
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download Official Admit Card
              </button>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-medium flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              Hall ticket is on hold due to pending fee clearance from accounts branch.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HallTicketPage() {
  return (
    <ExaminationProvider>
      <HallTicketContent />
    </ExaminationProvider>
  );
}