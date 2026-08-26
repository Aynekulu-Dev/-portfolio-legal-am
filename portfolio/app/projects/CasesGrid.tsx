"use client";

import { useState } from "react";
import { CaseCard } from "@/components/CaseCard";
import type { CaseFile } from "@/lib/data";

type Filter = "all" | "criminal" | "civil" | "commercial" | "research";

const TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "ሁሉም" },
  { value: "criminal", label: "የወንጀል መዝገቦች" },
  { value: "civil", label: "የፍትሐብሔር መዝገቦች" },
  { value: "commercial", label: "የንግድ መዝገቦች" },
  { value: "research", label: "ጥናቶች" }
];

export function CasesGrid({ items }: { items: CaseFile[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = items.filter((p) => filter === "all" || p.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            aria-pressed={filter === tab.value}
            className={`rounded-sm border px-3.5 py-1.5 transition-colors ${
              filter === tab.value
                ? "border-maroon text-maroon"
                : "border-border text-muted hover:text-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <CaseCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 font-mono text-sm text-muted">
          በዚህ ማጣሪያ ስር ምንም መዝገብ አልተገኘም።
        </p>
      )}
    </div>
  );
}
