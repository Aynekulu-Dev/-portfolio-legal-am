"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { RequireAdmin } from "@/components/admin/RequireAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="mx-auto flex min-h-screen max-w-md items-center px-6">{children}</div>;
  }

  return (
    <RequireAdmin>
      <div className="mx-auto flex min-h-screen max-w-content flex-col gap-8 px-6 py-10 md:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </RequireAdmin>
  );
}
