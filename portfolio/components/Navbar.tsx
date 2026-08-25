"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Scale } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const ROUTES: { path: string; label: string }[] = [
  { path: "/about", label: "ስለ እኔ" },
  { path: "/services", label: "አገልግሎቶች" },
  { path: "/projects", label: "መዝገቦች" },
  { path: "/blog", label: "ብሎግ" },
  { path: "/contact", label: "አግኙኝ" }
];

export function Navbar({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="መነሻ ገፅ">
          <span className="seal flex h-9 w-9 shrink-0 items-center justify-center text-maroon">
            <Scale size={16} strokeWidth={1.8} />
          </span>
          <span className="hidden sm:block">
            <span className="block font-display text-sm text-fg">{name}</span>
            <span className="block font-mono text-[11px] tracking-wide text-muted">
              ዐቃቤ ሕግ
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {ROUTES.map((r) => {
            const isActive = pathname.startsWith(r.path) && r.path !== "/";
            return (
              <Link
                key={r.path}
                href={r.path}
                className={`rounded-sm px-3 py-1.5 transition-colors ${
                  isActive ? "text-maroon" : "text-muted hover:text-fg"
                }`}
              >
                {r.label}
              </Link>
            );
          })}
          <span className="ml-2">
            <ThemeToggle />
          </span>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "ዝጋ" : "ክፈት"}
            aria-expanded={open}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-fg"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border px-6 py-3 text-sm md:hidden">
          {ROUTES.map((r) => {
            const isActive = pathname.startsWith(r.path);
            return (
              <Link
                key={r.path}
                href={r.path}
                onClick={() => setOpen(false)}
                className={`block py-2 ${isActive ? "text-maroon" : "text-muted"}`}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
