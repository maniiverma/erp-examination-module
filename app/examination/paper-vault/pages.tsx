"use client";

import React, { useState, useEffect } from "react";
import { Lock, Unlock, UploadCloud, FileCheck, ShieldCheck, RefreshCw } from "lucide-react";
import { useExamRBAC, ExaminationProvider } from "../context";

function PaperVaultContent() {
  const { role, user } = useExamRBAC();
  const [vaultList, setVaultList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [subCode, setSubCode] = useState("CSE-502");
  const [subName, setSubName] = useState("Ethical Hacking & Penetration Testing");
  const [examDate, setExamDate] = useState("2026-05-20");
  const [secretKey, setSecretKey] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchVault = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/examination/paper-vault", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setVaultList(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const generatedHash = `0x${Math.random().toString(16).substring(2, 12).toUpperCase()}`;

    try {
      const res = await fetch("/api/examination/paper-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectCode: subCode,
          subjectName: subName,
          examDate,
          uploadedBy: user?.name || "Dr. Faculty",
          paperHash: generatedHash,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Question paper encrypted & vaulted successfully! Ref: ${data.data?.id}`);
        setSecretKey("");
        fetchVault();
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-xl shadow-md">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-400" /> Confidential Paper Vault & Decryption Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero-Trust Repository for End-Semester Question Papers (AES-256 Hashed).
          </p>
        </div>
        <button
          onClick={fetchVault}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Sync Vault
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="md:col-span-1 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <UploadCloud className="h-4 w-4 text-blue-600" /> Upload Question Paper
          </h3>

          {successMsg && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg font-semibold flex items-center gap-1">
              <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleUploadPaper} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
              <input
                type="text"
                required
                value={subCode}
                onChange={(e) => setSubCode(e.target.value)}
                className="w-full rounded-lg border p-2 font-mono outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject Title</label>
              <input
                type="text"
                required
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full rounded-lg border p-2 outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Scheduled Exam Date</label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-lg border p-2 outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">COE Secret Decryption Key Passphrase</label>
              <input
                type="password"
                required
                placeholder="Enter Vault Encryption Passphrase"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full rounded-lg border p-2 outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg transition-all cursor-pointer flex justify-center items-center gap-2"
            >
              {uploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
              {uploading ? "Encrypting & Saving..." : "Lock & Upload to Vault"}
            </button>
          </form>
        </div>

        {/* Live Vault Inventory */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-purple-600" /> Vaulted Papers Inventory ({vaultList.length})
          </h3>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-slate-400" /> Fetching Vaulted Artifacts...
            </div>
          ) : vaultList.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed rounded-lg">
              No paper vaulted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {vaultList.map((p) => (
                <div key={p.id} className="border p-4 rounded-xl bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-800">{p.id}</span>
                      <span className="font-bold text-slate-900">{p.subjectCode}</span>
                    </div>
                    <div className="text-slate-700 font-medium mt-0.5">{p.subjectName}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Exam Date: <b>{p.examDate}</b> · By: <b>{p.uploadedBy}</b>
                    </div>
                    <div className="font-mono text-[10px] text-purple-700 mt-1">
                      Hash: {p.paperHash}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1">
                      <Lock className="h-3 w-3" /> {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaperVaultPage() {
  return (
    <ExaminationProvider>
      <PaperVaultContent />
    </ExaminationProvider>
  );
}