"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from "lucide-react";
import { useExamRBAC, UserRole } from "../context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useExamRBAC();

  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("student@ltsu.ac.in");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError("");
    if (role === "student") {
      setEmail("student@ltsu.ac.in");
      setPassword("student123");
    } else if (role === "teacher") {
      setEmail("teacher@ltsu.ac.in");
      setPassword("teacher123");
    } else if (role === "admin") {
      setEmail("admin@ltsu.ac.in");
      setPassword("admin123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password, selectedRole);
    if (res.success) {
      if (selectedRole === "student") router.push("/examination");
      else if (selectedRole === "teacher") router.push("/examination/faculty");
      else if (selectedRole === "admin") router.push("/examination/admin");
    } else {
      setError(res.error || "Authentication failed!");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#2b3a67] p-6 text-white text-center">
          <div className="h-14 w-14 rounded-full bg-white text-[#2b3a67] font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            LTSU
          </div>
          <h2 className="text-lg font-bold">University ERP Portal</h2>
          <p className="text-xs text-slate-300 mt-0.5">Zero-Trust Role Based Authentication</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Portal Role</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect("student")}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedRole === "student"
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("teacher")}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedRole === "teacher"
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedRole === "admin"
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                COE / Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">University Email / ID</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#2b3a67] text-white font-bold py-2.5 rounded-lg hover:bg-blue-900 transition-all cursor-pointer shadow-md"
            >
              <span>Login to {selectedRole.toUpperCase()} Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Demo Passwords Card */}
          <div className="p-3 bg-slate-50 border rounded-lg text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Default Role Passwords:</span>
            <div className="flex justify-between"><span>Student:</span> <b className="font-mono">student123</b></div>
            <div className="flex justify-between"><span>Teacher:</span> <b className="font-mono">teacher123</b></div>
            <div className="flex justify-between"><span>COE / Admin:</span> <b className="font-mono">admin123</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}