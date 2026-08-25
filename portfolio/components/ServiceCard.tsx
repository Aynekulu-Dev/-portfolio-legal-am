import { Scale, Users, BookOpen, FileText, type LucideIcon } from "lucide-react";
import type { Service } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  scale: Scale,
  users: Users,
  "book-open": BookOpen,
  "file-text": FileText
};

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon] ?? Scale;

  return (
    <div className="group rounded-sm border border-border bg-surface p-6 transition-colors hover:border-maroon">
      <Icon size={22} className="text-maroon" strokeWidth={1.6} />
      <h3 className="mt-4 font-display text-lg text-fg">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
    </div>
  );
}
