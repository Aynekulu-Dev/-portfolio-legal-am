"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, LogIn } from "lucide-react";
import { adminLogin, clearAdminCredentials, ApiError } from "@/lib/admin/client";

// Backend URL comes straight from the build-time env var — no visible field,
// so the admin only ever has to enter email + password.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(API_URL, email.trim(), password);
      router.replace("/admin/profile");
    } catch (err) {
      clearAdminCredentials();
      if (err instanceof ApiError && err.status === 401) {
        setError("የተሳሳተ ኢሜይል ወይም የይለፍ ቃል ነው።");
      } else if (err instanceof ApiError && err.status === 429) {
        setError("ብዙ ሙከራዎች ተደርገዋል፤ ትንሽ ቆይተው ደግመው ይሞክሩ።");
      } else {
        setError("ግንኙነት አልተሳካም — Backend URL ትክክል መሆኑን እና backend እየሮጠ መሆኑን ያረጋግጡ።");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <p className="font-mono text-xs text-maroon">Admin</p>
      <h1 className="mt-3 font-display text-3xl text-fg">ግባ</h1>
      <p className="mt-2 text-sm text-muted">ይህ portfolio ባለቤት ብቻ የሚደርስበት ገፅ ነው።</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">Email</label>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@example.com"
            className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">የይለፍ ቃል</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon"
          />
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm text-maroon">
            <AlertCircle size={14} /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-sm bg-maroon px-5 py-2.5 font-mono text-sm text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
          {loading ? "በማረጋገጥ ላይ..." : "ግባ"}
        </button>
      </form>
    </div>
  );
}
