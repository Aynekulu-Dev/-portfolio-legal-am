"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "ስም ያስፈልጋል።";
  if (!values.email.trim()) {
    errors.email = "ኢሜይል ያስፈልጋል።";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "ትክክለኛ ኢሜይል ያስገቡ።";
  }
  if (!values.message.trim()) {
    errors.message = "አጭር መልእክት ይጻፉ።";
  } else if (values.message.trim().length < 10) {
    errors.message = "መልእክቱ ቢያንስ 10 ፊደላት ይኑረው።";
  }
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Honeypot field: real visitors never fill this in.
  const [company, setCompany] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (company) return; // silently drop likely-bot submissions

    setStatus("submitting");
    try {
      if (!API_URL) throw new Error("API not configured");

      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: values.name,
          sender_email: values.email,
          message: values.message
        })
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-sm border border-brass/40 bg-surface p-6">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brass" />
        <div>
          <p className="font-display text-lg text-fg">መልእክትዎ ተልኳል።</p>
          <p className="mt-1 text-sm text-muted">
            እናመሰግናለን — በቅርቡ ምላሽ እናደርስዎታለን።
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from real visitors, catches bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-muted">
          ስም
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 flex items-center gap-1 text-xs text-maroon">
            <AlertCircle size={12} /> {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-muted">
          ኢሜይል
        </label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 flex items-center gap-1 text-xs text-maroon">
            <AlertCircle size={12} /> {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-muted">
          መልእክት
        </label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className="w-full resize-none rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-maroon"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 flex items-center gap-1 text-xs text-maroon">
            <AlertCircle size={12} /> {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-maroon">
          <AlertCircle size={14} /> መላክ አልተቻለም። NEXT_PUBLIC_API_URL መቀናበሩን ያረጋግጡና እንደገና ይሞክሩ።
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex items-center gap-2 rounded-sm bg-maroon px-5 py-2.5 font-mono text-sm text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 size={14} className="animate-spin" />}
        {status === "submitting" ? "በመላክ ላይ..." : "መልእክት ላክ"}
      </button>
    </form>
  );
}
