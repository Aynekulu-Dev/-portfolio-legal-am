"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { adminFetch, clearAdminCredentials, getAdminToken, getApiUrl, ApiError } from "@/lib/admin/client";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    const token = getAdminToken();
    const url = getApiUrl();
    if (!token || !url) {
      router.replace("/admin/login");
      return;
    }
    // Confirm the stored token is still valid.
    adminFetch("/auth/me")
      .then(() => setStatus("ok"))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) clearAdminCredentials();
        router.replace("/admin/login");
      });
  }, [router]);

  if (status === "checking") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" /> በማረጋገጥ ላይ...
      </div>
    );
  }

  return <>{children}</>;
}
