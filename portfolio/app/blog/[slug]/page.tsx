import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getBlogPostBySlug, getBlogPosts, estimateReadingTime } from "@/lib/data";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("am-ET", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/blog"
        className="flex items-center gap-2 font-mono text-xs text-muted hover:text-maroon"
      >
        <ArrowLeft size={13} /> ወደ ብሎግ ተመለስ
      </Link>

      <div className="mt-6 flex items-center gap-3 font-mono text-xs text-muted">
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        <span aria-hidden="true">·</span>
        <span>{estimateReadingTime(post.content)} ደቂቃ ንባብ</span>
      </div>

      <h1 className="mt-4 font-display text-3xl leading-tight text-fg sm:text-4xl">
        {post.title}
      </h1>

      <div className="prose-log mt-10 max-w-none space-y-4 text-[15px] leading-relaxed text-fg [&_code]:rounded-sm [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-fg [&_li]:ml-5 [&_li]:list-decimal [&_p]:text-muted [&_strong]:text-fg">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
