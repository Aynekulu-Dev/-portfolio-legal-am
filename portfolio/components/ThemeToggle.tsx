"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-8" aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "ወደ ብርሃን ገጽታ ቀይር" : "ወደ ጨለማ ገጽታ ቀይር"}
      className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted transition-colors hover:border-maroon hover:text-maroon"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
