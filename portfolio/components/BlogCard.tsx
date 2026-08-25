import Link from "next/link";
import type { BlogPost } from "@/lib/data";
import { estimateReadingTime } from "@/lib/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("am-ET", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-sm border border-border bg-surface p-6 transition-colors hover:border-maroon"
    >
      <div className="flex items-center gap-3 font-mono text-xs text-muted">
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        <span aria-hidden="true">·</span>
        <span>{estimateReadingTime(post.content)} ደቂቃ ንባብ</span>
      </div>
      <h3 className="mt-3 font-display text-xl text-fg group-hover:text-maroon">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
    </Link>
  );
}
