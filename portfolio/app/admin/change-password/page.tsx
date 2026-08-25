"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Check, AlertCircle, KeyRound } from "lucide-react";
import { adminFetch, ApiError } from "@/lib/admin/client";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

const inputClass =
  "w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon";
const labelClass = "mb-1.5 block font-mono text-xs text-muted";

export default function AdminChangePasswordPage() {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function field(name: keyof typeof EMPTY) {
    return {
      value: form[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [name]: e.target.value }))
    };
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (form.newPassword.length < 8) {
      setError("አዲሱ የይለፍ ቃል ቢያንስ 8 ፊደላት ሊኖረው ይገባል።");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("አዲሱ የይለፍ ቃል ከማረጋገጫው ጋር አይመሳሰልም።");
      return;
    }

    setSaving(true);
    try {
      // Field names match ChangePasswordDto on the backend exactly (camelCase).
      await adminFetch("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });
      setSaved(true);
      setForm(EMPTY);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("የአሁኑ የይለፍ ቃል ትክክል አይደለም።");
      } else {
        setError(err instanceof Error ? err.message : "አልተሳካም።");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-fg">የይለፍ ቃል ቀይር</h1>
      <p className="mt-1 text-sm text-muted">የ admin መግቢያ የይለፍ ቃልህን ከዚህ ቀይር።</p>

      <form onSubmit={save} className="mt-6 max-w-md space-y-5">
        <div>
          <label className={labelClass}>የአሁኑ የይለፍ ቃል</label>
          <input type="password" autoComplete="current-password" required {...field("currentPassword")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>አዲስ የይለፍ ቃል</label>
          <input type="password" autoComplete="new-password" required {...field("newPassword")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>አዲሱን የይለፍ ቃል አረጋግጥ</label>
          <input type="password" autoComplete="new-password" required {...field("confirmPassword")} className={inputClass} />
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm text-maroon">
            <AlertCircle size={14} /> {error}
          </p>
        )}
        {saved && (
          <p className="flex items-center gap-2 text-sm text-brass">
            <Check size={14} /> የይለፍ ቃል ተቀይሯል።
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-sm bg-maroon px-5 py-2.5 font-mono text-sm text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
          {saving ? "በመቀየር ላይ..." : "ቀይር"}
        </button>
      </form>
    </div>
  );
}
