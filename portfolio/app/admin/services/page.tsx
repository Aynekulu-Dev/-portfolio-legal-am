"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Pencil, X, Check, AlertCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin/client";

type ServiceRow = { id: number; title: string; description: string; icon: string | null };

const EMPTY = { title: "", description: "", icon: "" };
const inputClass =
  "w-full rounded-sm border border-border bg-surface2 px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon";

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminFetch<ServiceRow[]>("/services"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item?: ServiceRow) {
    setError(null);
    if (item) {
      setEditingId(item.id);
      setForm({ title: item.title, description: item.description, icon: item.icon ?? "" });
    } else {
      setEditingId("new");
      setForm(EMPTY);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const body = JSON.stringify({ ...form, icon: form.icon || undefined });
      if (editingId === "new") {
        await adminFetch("/services", { method: "POST", body });
      } else if (editingId != null) {
        await adminFetch(`/services/${editingId}`, { method: "PATCH", body });
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
    if (!confirm("ይህን አገልግሎት መሰረዝ ትፈልጋለህ?")) return;
    try {
      await adminFetch(`/services/${id}`, { method: "DELETE" });
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-fg">አገልግሎቶች</h1>
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
            placeholder="Icon (lucide name, ለምሳሌ scale)"
            value={form.icon}
            onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
            className={inputClass}
          />
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
                <p className="font-display text-base text-fg">{item.title}</p>
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
          {items.length === 0 && <p className="p-4 text-sm text-muted">ምንም አገልግሎት አልተመዘገበም።</p>}
        </div>
      )}
    </div>
  );
}
