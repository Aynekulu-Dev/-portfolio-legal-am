"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { Profile } from "@/lib/data";

export function SiteChrome({ name, profile, children }: { name: string; profile: Profile; children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // The admin section renders its own shell (see app/admin/layout.tsx).
    return <>{children}</>;
  }

  return (
    <>
      <Navbar name={name} />
      <main className="flex-1">{children}</main>
      <Footer profile={profile} />
    </>
  );
}
