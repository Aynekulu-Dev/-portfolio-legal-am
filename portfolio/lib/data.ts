import profileFallback from "@/data/profile.json";
import servicesFallback from "@/data/services.json";
import projectsFallback from "@/data/projects.json";
import blogFallback from "@/data/blog.json";

// Reads live data from the NestJS backend (NEXT_PUBLIC_API_URL). Falls back
// to the local JSON files in /data if the API URL isn't set or a request
// fails, so the site still renders something during outages.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Profile = typeof profileFallback;
export type Service = (typeof servicesFallback)[number];
export type CaseFile = (typeof projectsFallback)[number];
export type BlogPost = (typeof blogFallback)[number];

async function apiFetch<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      // Revalidate periodically instead of caching forever or hitting the
      // API on every single request.
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// The backend (drizzle/postgres) returns camelCase field names, while the
// frontend components/types use snake_case (matching the original static
// JSON shape). These small mappers bridge the two.

function mapProfile(row: any): Profile {
  return {
    full_name: row.fullName,
    headline: row.headline,
    bio: row.bio,
    avatar_url: row.avatarUrl,
    resume_url: row.resumeUrl,
    socials: row.socials ?? {},
    location: row.location,
    years_experience: row.yearsExperience,
    focus_areas: row.focusAreas ?? []
  };
}

function mapCase(row: any): CaseFile {
  return {
    id: row.id,
    case_no: row.caseNo,
    title: row.title,
    description: row.description,
    category: row.category,
    statutes: row.statutes ?? [],
    court: row.court,
    outcome: row.outcome,
    created_at: row.createdAt
  };
}

function mapBlogPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    published_at: row.publishedAt
  };
}

export async function getProfile(): Promise<Profile> {
  const row = await apiFetch<any>("/profile");
  return row ? mapProfile(row) : profileFallback;
}

export async function getServices(): Promise<Service[]> {
  const rows = await apiFetch<any[]>("/services");
  return rows ?? servicesFallback;
}

export async function getCases(): Promise<CaseFile[]> {
  const rows = await apiFetch<any[]>("/projects");
  return rows ? rows.map(mapCase) : projectsFallback;
}

export async function getCasesByCategory(
  category: "criminal" | "research"
): Promise<CaseFile[]> {
  const all = await getCases();
  return all.filter((p) => p.category === category);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await apiFetch<any[]>("/blog");
  const posts = rows ? rows.map(mapBlogPost) : blogFallback;
  return [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const row = await apiFetch<any>(`/blog/${slug}`);
  if (row) return mapBlogPost(row);
  return blogFallback.find((p) => p.slug === slug);
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
