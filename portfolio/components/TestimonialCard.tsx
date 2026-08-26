import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/data";

export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="rounded-sm border border-border bg-surface p-6">
      <Quote size={18} className="text-brass" strokeWidth={1.6} />
      <p className="mt-4 text-sm leading-relaxed text-fg">{item.quote}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        {item.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.avatar_url}
            alt={item.name}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-muted">
            {item.name.slice(0, 1)}
          </div>
        )}
        <div>
          <p className="font-display text-sm text-fg">{item.name}</p>
          {item.role && <p className="font-mono text-[11px] text-muted">{item.role}</p>}
        </div>
      </div>
    </div>
  );
}
