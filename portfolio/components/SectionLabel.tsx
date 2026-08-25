export function SectionLabel({ article, name }: { article: string; name: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="font-mono text-xs text-maroon">አንቀጽ {article}</span>
      <h2 className="font-display text-2xl text-fg sm:text-3xl">{name}</h2>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}
