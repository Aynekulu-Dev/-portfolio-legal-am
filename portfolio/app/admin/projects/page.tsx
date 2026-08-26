"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Pencil, X, Check, AlertCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin/client";

type ProjectRow = {
  id: number;
  caseNo: string | null;
  title: string;
  description: string;
  category: "criminal" | "civil" | "commercial" | "research";
  statutes: string[] | null;
  court: string | null;
  outcome: string | null;
};

const EMPTY = {
  case_no: "",
  title: "",
  description: "",
  category: "criminal" as "criminal" | "civil" | "commercial" | "research",
  statutes: "",
  court: "",
  outcome: ""
};

const inputClass =
  "w-full rounded-sm border border-border bg-surface2 px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon";

export default function AdminProjectsPage() {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminFetch<ProjectRow[]>("/projects"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item?: ProjectRow) {
    setError(null);
    if (item) {
      setEditingId(item.id);
      setForm({
        case_no: item.caseNo ?? "",
        title: item.title,
        description: item.description,
        category: item.category,
        statutes: (item.statutes ?? []).join(", "),
        court: item.court ?? "",
        outcome: item.outcome ?? ""
      });
    } else {
      setEditingId("new");
      setForm(EMPTY);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const body = JSON.stringify({
        case_no: form.case_no || undefined,
        title: form.title,
        description: form.description,
        category: form.category,
        statutes: form.statutes ? form.statutes.split(",").map((s) => s.trim()).filter(Boolean) : [],
        court: form.court || undefined,
        outcome: form.outcome || undefined
      });
      if (editingId === "new") {
        await adminFetch("/projects", { method: "POST", body });
      } else if (editingId != null) {
        await adminFetch(`/projects/${editingId}`, { method: "PATCH", body });
      }
      setEditingId(null);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("ይህን መዝገብ መሰረዝ ትፈልጋለህ?")) return;
    try {
      await adminFetch(`/projects/${id}`, { method: "DELETE" });
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-fg">መዝገቦች</h1>
        <button
          onClick={() => startEdit()}
          className="flex items-center gap-1.5 rounded-sm bg-maroon px-4 py-2 font-mono text-xs text-ink hover:opacity-90"
        >
          <Plus size={14} /> አዲስ
        </button>
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-2 text-sm text-maroon">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      {editingId !== null && (
        <div className="mt-6 space-y-3 rounded-sm border border-border bg-surface p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="የመዝገብ ቁጥር (ካለ)"
              value={form.case_no}
              onChange={(e) => setForm((f) => ({ ...f, case_no: e.target.value }))}
              className={inputClass}
            />
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as "criminal" | "civil" | "commercial" | "research" }))}
              className={inputClass}
            >
              <option value="criminal">ወንጀል (criminal)</option>
              <option value="civil">ፍትሐብሔር (civil)</option>
              <option value="commercial">ንግድ (commercial)</option>
              <option value="research">ጥናት (research)</option>
            </select>
          </div>
          <input
            placeholder="ርዕስ"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={inputClass}
          />
          <textarea
            placeholder="መግለጫ"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className={inputClass}
          />
          <input
            placeholder="ሕጎች (statutes) — በኮማ የተለያዩ"
            value={form.statutes}
            onChange={(e) => setForm((f) => ({ ...f, statutes: e.target.value }))}
            className={inputClass}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="ፍርድ ቤት"
              value={form.court}
              onChange={(e) => setForm((f) => ({ ...f, court: e.target.value }))}
              className={inputClass}
            />
            <input
              placeholder="ውጤት"
              value={form.outcome}
              onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-sm bg-maroon px-4 py-2 font-mono text-xs text-ink hover:opacity-90 disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} አስቀምጥ
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="flex items-center gap-1.5 rounded-sm border border-border px-4 py-2 font-mono text-xs text-muted hover:text-fg"
            >
              <X size={14} /> ተወው
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-muted">በመጫን ላይ...</p>
      ) : (
        <div className="mt-6 divide-y divide-border rounded-sm border border-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="font-mono text-[11px] text-muted">
                  {item.caseNo || "—"} ·{" "}
                  {{ criminal: "ወንጀል", civil: "ፍትሐብሔር", commercial: "ንግድ", research: "ጥናት" }[
                    item.category
                  ] ?? item.category}
                </p>
                <p className="mt-1 font-display text-base text-fg">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="rounded-sm border border-border p-2 text-muted hover:text-fg"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="rounded-sm border border-border p-2 text-muted hover:text-maroon"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="p-4 text-sm text-muted">ምንም መዝገብ አልተመዘገበም።</p>}
        </div>
      )}
    </div>
  );
}
