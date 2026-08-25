"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, AlertCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin/client";

type MessageRow = {
  id: number;
  senderName: string;
  senderEmail: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminContactPage() {
  const [items, setItems] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminFetch<MessageRow[]>("/contact"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: number) {
    // Optimistic update
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    try {
      await adminFetch(`/contact/${id}/read`, { method: "PATCH" });
    } catch (err: any) {
      setError(err.message);
      load();
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-fg">መልእክቶች</h1>

      {error && (
        <p className="mt-4 flex items-center gap-2 text-sm text-maroon">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-muted">በመጫን ላይ...</p>
      ) : (
        <div className="mt-6 divide-y divide-border rounded-sm border border-border">
          {items.map((m) => (
            <div key={m.id} className={`p-4 ${m.isRead ? "" : "bg-surface"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-base text-fg">{m.senderName}</p>
                  <p className="font-mono text-xs text-muted">{m.senderEmail}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[11px] text-muted">
                    {new Date(m.createdAt).toLocaleString("am-ET")}
                  </span>
                  {!m.isRead && (
                    <button
                      onClick={() => markRead(m.id)}
                      className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-[11px] text-muted hover:text-fg"
                    >
                      <MailOpen size={12} /> እንደተነበበ ምልክት አድርግ
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-fg">{m.message}</p>
            </div>
          ))}
          {items.length === 0 && (
            <p className="flex items-center gap-2 p-4 text-sm text-muted">
              <Mail size={14} /> ምንም መልእክት አልደረሰም።
            </p>
          )}
        </div>
      )}
    </div>
  );
}
