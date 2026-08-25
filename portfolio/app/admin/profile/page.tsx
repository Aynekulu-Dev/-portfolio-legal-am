"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { adminFetch, ApiError } from "@/lib/admin/client";

type ProfileRow = {
  id: number;
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string | null;
  resumeUrl: string | null;
  location: string | null;
  yearsExperience: number | null;
  focusAreas: string[] | null;
  socials: Record<string, string> | null;
};

const EMPTY = {
  full_name: "",
  headline: "",
  bio: "",
  avatar_url: "",
  resume_url: "",
  location: "",
  years_experience: "",
  focus_areas: "",
  linkedin: "",
  telegram: "",
  email: ""
};

export default function AdminProfilePage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch<ProfileRow>("/profile")
      .then((p) => {
        setForm({
          full_name: p.fullName ?? "",
          headline: p.headline ?? "",
          bio: p.bio ?? "",
          avatar_url: p.avatarUrl ?? "",
          resume_url: p.resumeUrl ?? "",
          location: p.location ?? "",
          years_experience: p.yearsExperience != null ? String(p.yearsExperience) : "",
          focus_areas: (p.focusAreas ?? []).join(", "),
          linkedin: p.socials?.linkedin ?? "",
          telegram: p.socials?.telegram ?? "",
          email: p.socials?.email ?? ""
        });
      })
      .catch((err) => {
        // No profile row yet is fine on a fresh DB — start from a blank form.
        if (!(err instanceof ApiError && err.status === 404)) setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  function field(name: keyof typeof EMPTY) {
    return {
      value: form[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [name]: e.target.value }))
    };
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await adminFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          full_name: form.full_name,
          headline: form.headline,
          bio: form.bio,
          avatar_url: form.avatar_url || undefined,
          resume_url: form.resume_url || undefined,
          location: form.location || undefined,
          years_experience: form.years_experience ? Number(form.years_experience) : undefined,
          focus_areas: form.focus_areas
            ? form.focus_areas.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined,
          socials: {
            ...(form.linkedin && { linkedin: form.linkedin }),
            ...(form.telegram && { telegram: form.telegram }),
            ...(form.email && { email: form.email })
          }
        })
      });
      setSaved(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon";
  const labelClass = "mb-1.5 block font-mono text-xs text-muted";

  if (loading) return <p className="text-sm text-muted">በመጫን ላይ...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-fg">መገለጫ</h1>

      <form onSubmit={save} className="mt-6 max-w-2xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>ሙሉ ስም</label>
            <input {...field("full_name")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>ማዕረግ / ሙያ</label>
            <input {...field("headline")} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>ባዮግራፊ</label>
          <textarea rows={5} {...field("bio")} className={inputClass} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Avatar URL</label>
            <input {...field("avatar_url")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Resume URL</label>
            <input {...field("resume_url")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>አድራሻ</label>
            <input {...field("location")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>የስራ ልምድ (ዓመታት)</label>
            <input type="number" min={0} {...field("years_experience")} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>የትኩረት መስኮች (በኮማ የተለያዩ)</label>
          <input {...field("focus_areas")} className={inputClass} />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input {...field("linkedin")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telegram</label>
            <input {...field("telegram")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email (mailto:...)</label>
            <input {...field("email")} className={inputClass} />
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm text-maroon">
            <AlertCircle size={14} /> {error}
          </p>
        )}
        {saved && (
          <p className="flex items-center gap-2 text-sm text-brass">
            <Check size={14} /> ተቀምጧል።
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-sm bg-maroon px-5 py-2.5 font-mono text-sm text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {saving ? "በማስቀመጥ ላይ..." : "አስቀምጥ"}
        </button>
      </form>
    </div>
  );
}
