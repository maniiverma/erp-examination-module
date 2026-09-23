"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "teacher" | "student";

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  modules?: number[];
}

export function useAuth(allowed?: UserRole[]) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error || !d.role) {
          // Dev mock fallback for local testing
          setUser({
            userId: "usr_student_01",
            email: "student@ltsu.ac.in",
            role: "student",
          });
          setLoading(false);
          return;
        }
        if (allowed && !allowed.includes(d.role)) {
          return router.push("/dashboard?error=forbidden");
        }
        setUser(d);
        setLoading(false);
      })
      .catch(() => {
        // Fallback fallback for offline / mock testing
        setUser({
          userId: "usr_student_01",
          email: "student@ltsu.ac.in",
          role: "student",
        });
        setLoading(false);
      });
  }, [allowed, router]);

  return { user, loading };
}