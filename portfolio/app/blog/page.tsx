import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/data";

export const metadata: Metadata = { title: "ብሎግ" };

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-content px-6 py-20">
      <p className="font-mono text-xs text-maroon">ብሎግ</p>
      <h1 className="mt-3 font-display text-4xl text-fg">ማስታወሻዎች</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
        ከልምድ የተገኙ አጫጭር ማስታወሻዎች — ስለ ማስረጃ አያያዝ፣ ስለ ምስክር ዝግጅት እና ስለ ክስ ሂደት።
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
