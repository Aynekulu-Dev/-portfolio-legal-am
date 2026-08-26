"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, AlertCircle, Upload, Plus, Trash2 } from "lucide-react";
import { adminFetch, adminUploadFile, ApiError } from "@/lib/admin/client";

type TimelineItem = { date: string; role: string; org: string; detail: string };
type CredentialGroup = { group: string; items: string[] };

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
  timeline: TimelineItem[] | null;
  credentials: CredentialGroup[] | null;
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
  email: "",
  phone: ""
};

const EMPTY_TIMELINE_ITEM: TimelineItem = { date: "", role: "", org: "", detail: "" };
const EMPTY_CREDENTIAL_GROUP: CredentialGroup = { group: "", items: [""] };

export default function AdminProfilePage() {
  const [form, setForm] = useState(EMPTY);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [credentials, setCredentials] = useState<CredentialGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

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
          email: p.socials?.email ?? "",
          phone: p.socials?.phone ?? ""
        });
        setTimeline(p.timeline && p.timeline.length ? p.timeline : []);
        setCredentials(p.credentials && p.credentials.length ? p.credentials : []);
      })
      .catch((err) => {
        // No profile row yet is fine on a fresh DB — start from a blank form.
        if (!(err instanceof ApiError && err.status === 404)) setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Timeline helpers ---
  function updateTimelineItem(index: number, patch: Partial<TimelineItem>) {
    setTimeline((items) => items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }
  function addTimelineItem() {
    setTimeline((items) => [...items, { ...EMPTY_TIMELINE_ITEM }]);
  }
  function removeTimelineItem(index: number) {
    setTimeline((items) => items.filter((_, i) => i !== index));
  }

  // --- Credentials helpers ---
  function updateCredentialGroupName(index: number, groupName: string) {
    setCredentials((groups) => groups.map((g, i) => (i === index ? { ...g, group: groupName } : g)));
  }
  function updateCredentialItems(index: number, itemsText: string) {
    const items = itemsText.split("\n");
    setCredentials((groups) => groups.map((g, i) => (i === index ? { ...g, items } : g)));
  }
  function addCredentialGroup() {
    setCredentials((groups) => [...groups, { ...EMPTY_CREDENTIAL_GROUP }]);
  }
  function removeCredentialGroup(index: number) {
    setCredentials((groups) => groups.filter((_, i) => i !== index));
  }

  async function handleFileSelect(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "avatar" | "resume"
  ) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    const setUploading = kind === "avatar" ? setUploadingAvatar : setUploadingResume;
    const fieldName = kind === "avatar" ? "avatar_url" : "resume_url";

    setUploading(true);
    setError(null);
    try {
      const { url } = await adminUploadFile(`/uploads/${kind}`, file);
      setForm((f) => ({ ...f, [fieldName]: url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

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
            ...(form.email && { email: form.email }),
            ...(form.phone && { phone: form.phone })
          },
          timeline: timeline
            .filter((t) => t.date || t.role || t.org || t.detail)
            .map((t) => ({ date: t.date, role: t.role, org: t.org, detail: t.detail })),
          credentials: credentials
            .filter((c) => c.group)
            .map((c) => ({
              group: c.group,
              items: c.items.map((i) => i.trim()).filter(Boolean)
            }))
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
            <div className="flex gap-2">
              <input {...field("avatar_url")} className={inputClass} />
              <label
                className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border border-border px-3 py-2.5 font-mono text-xs text-fg transition-colors hover:border-maroon hover:text-maroon ${uploadingAvatar ? "pointer-events-none opacity-60" : ""}`}
              >
                {uploadingAvatar ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Upload size={13} />
                )}
                ፎቶ ላክ
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, "avatar")}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
          </div>
          <div>
            <label className={labelClass}>Resume URL</label>
            <div className="flex gap-2">
              <input {...field("resume_url")} className={inputClass} />
              <label
                className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border border-border px-3 py-2.5 font-mono text-xs text-fg transition-colors hover:border-maroon hover:text-maroon ${uploadingResume ? "pointer-events-none opacity-60" : ""}`}
              >
                {uploadingResume ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Upload size={13} />
                )}
                PDF ላክ
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, "resume")}
                  disabled={uploadingResume}
                />
              </label>
            </div>
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <div>
            <label className={labelClass}>ስልክ (tel:+251...)</label>
            <input {...field("phone")} placeholder="tel:+251913149876" className={inputClass} />
          </div>
        </div>

        {/* Timeline (work experience) */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={labelClass}>የስራ ልምድ (Timeline)</label>
            <button
              type="button"
              onClick={addTimelineItem}
              className="flex items-center gap-1 rounded-sm border border-border px-2.5 py-1 font-mono text-xs text-fg transition-colors hover:border-maroon hover:text-maroon"
            >
              <Plus size={12} /> ጨምር
            </button>
          </div>
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="rounded-sm border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">#{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTimelineItem(i)}
                    className="text-muted transition-colors hover:text-maroon"
                    aria-label="ሰርዝ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>ቀን (ለምሳሌ 2019 – 2023)</label>
                    <input
                      value={item.date}
                      onChange={(e) => updateTimelineItem(i, { date: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ማዕረግ / ሚና</label>
                    <input
                      value={item.role}
                      onChange={(e) => updateTimelineItem(i, { role: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>ድርጅት</label>
                    <input
                      value={item.org}
                      onChange={(e) => updateTimelineItem(i, { org: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>ዝርዝር</label>
                    <textarea
                      rows={2}
                      value={item.detail}
                      onChange={(e) => updateTimelineItem(i, { detail: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
            {timeline.length === 0 && (
              <p className="text-sm text-muted">ገና ምንም አልተጨመረም። &quot;ጨምር&quot; ተጫን።</p>
            )}
          </div>
        </div>

        {/* Credentials (education / skills groups) */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={labelClass}>ብቃት እና ትምህርት (Credentials)</label>
            <button
              type="button"
              onClick={addCredentialGroup}
              className="flex items-center gap-1 rounded-sm border border-border px-2.5 py-1 font-mono text-xs text-fg transition-colors hover:border-maroon hover:text-maroon"
            >
              <Plus size={12} /> ቡድን ጨምር
            </button>
          </div>
          <div className="space-y-4">
            {credentials.map((group, i) => (
              <div key={i} className="rounded-sm border border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <input
                    value={group.group}
                    onChange={(e) => updateCredentialGroupName(i, e.target.value)}
                    placeholder="የቡድን ስም (ለምሳሌ: ትምህርት)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeCredentialGroup(i)}
                    className="shrink-0 text-muted transition-colors hover:text-maroon"
                    aria-label="ሰርዝ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <label className={labelClass}>ዝርዝሮች (እያንዳንዱን በአዲስ መስመር ላይ ጻፍ)</label>
                <textarea
                  rows={4}
                  value={group.items.join("\n")}
                  onChange={(e) => updateCredentialItems(i, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
            {credentials.length === 0 && (
              <p className="text-sm text-muted">ገና ምንም አልተጨመረም። &quot;ቡድን ጨምር&quot; ተጫን።</p>
            )}
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