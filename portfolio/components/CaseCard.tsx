import type { CaseFile } from "@/lib/data";

const CATEGORY_LABEL: Record<string, string> = {
  criminal: "የወንጀል መዝገብ",
  civil: "የፍትሐብሔር መዝገብ",
  commercial: "የንግድ መዝገብ",
  research: "ጥናትና ትንተና"
};

export function CaseCard({ item }: { item: CaseFile }) {
  return (
    <article className="flex flex-col rounded-sm border border-border bg-surface p-6 transition-colors hover:border-maroon">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-brass">{item.case_no}</span>
        <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[11px] text-muted">
          {CATEGORY_LABEL[item.category] ?? item.category}
        </span>
      </div>

      <h3 className="mt-3 font-display text-lg text-fg">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.statutes.map((s) => (
          <span
            key={s}
            className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs">
        {item.court && <span className="text-muted">{item.court}</span>}
        <span className="font-mono text-maroon">{item.outcome}</span>
      </div>
    </article>
  );
}
