import profile from "@/data/profile.json";
import services from "@/data/services.json";
import projects from "@/data/projects.json";
import blog from "@/data/blog.json";

export type Profile = typeof profile;
export type Service = (typeof services)[number];
export type CaseFile = (typeof projects)[number];
export type BlogPost = (typeof blog)[number];

// These read from local config/JSON for the self-hosted static template.
// Swap the bodies below for real fetch() calls to the NestJS API
// (e.g. `${process.env.NEXT_PUBLIC_API_URL}/profile`) to go fully dynamic.

export function getProfile(): Profile {
  return profile;
}

export function getServices(): Service[] {
  return services;
}

export function getCases(): CaseFile[] {
  return projects;
}

export function getCasesByCategory(category: "criminal" | "research"): CaseFile[] {
  return projects.filter((p) => p.category === category);
}

export function getBlogPosts(): BlogPost[] {
  return [...blog].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blog.find((p) => p.slug === slug);
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
