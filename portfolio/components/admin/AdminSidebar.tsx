"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearAdminCredentials } from "@/lib/admin/client";

const LINKS = [
  { href: "/admin/profile", label: "መገለጫ" },
  { href: "/admin/services", label: "አገልግሎቶች" },
  { href: "/admin/projects", label: "መዝገቦች" },
  { href: "/admin/blog", label: "ብሎግ" },
  { href: "/admin/contact", label: "መልእክቶች" },
  { href: "/admin/change-password", label: "የይለፍ ቃል" }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-full shrink-0 md:w-48">
      <p className="font-mono text-xs text-maroon">Admin</p>
      <nav className="mt-4 flex gap-1 overflow-x-auto md:block md:space-y-1 md:overflow-visible">
        {LINKS.map((l) => {
          const active = pathname?.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`block shrink-0 rounded-sm px-3 py-2 text-sm transition-colors ${
                active ? "bg-surface2 text-maroon" : "text-muted hover:text-fg"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          clearAdminCredentials();
          router.replace("/admin/login");
        }}
        className="mt-8 hidden w-full items-center gap-2 rounded-sm border border-border px-3 py-2 text-left text-sm text-muted transition-colors hover:text-fg md:flex"
      >
        <LogOut size={14} /> ውጣ
      </button>
    </aside>
  );
}
