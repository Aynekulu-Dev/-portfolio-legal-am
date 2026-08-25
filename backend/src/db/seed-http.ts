// Alternative to seed.ts for networks that block outbound TCP port 5432.
// See migrate-http.ts for details. Usage: npm run db:seed:http
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as fs from "node:fs";
import * as path from "node:path";
import * as bcrypt from "bcryptjs";
import { profile, services, projects, blogPosts, admins } from "./schema";

// Points at the frontend's /data folder by default. Override with
// FRONTEND_DATA_DIR if this backend lives in a different location relative
// to the Next.js template.
const DATA_DIR = process.env.FRONTEND_DATA_DIR || path.join(__dirname, "../../../portfolio/data");

function readJson<T>(file: string): T {
  const full = path.join(DATA_DIR, file);
  return JSON.parse(fs.readFileSync(full, "utf-8"));
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const sql = neon(connectionString);
  const db = drizzle(sql);

  console.log(`Seeding from ${DATA_DIR} ...`);

  const profileData = readJson<any>("profile.json");
  await db.insert(profile).values({
    fullName: profileData.full_name,
    headline: profileData.headline,
    bio: profileData.bio,
    avatarUrl: profileData.avatar_url,
    resumeUrl: profileData.resume_url,
    socials: profileData.socials,
    location: profileData.location,
    yearsExperience: profileData.years_experience,
    focusAreas: profileData.focus_areas
  });
  console.log("  profile seeded");

  const servicesData = readJson<any[]>("services.json");
  if (servicesData.length) {
    await db.insert(services).values(
      servicesData.map((s) => ({ title: s.title, description: s.description, icon: s.icon }))
    );
    console.log(`  ${servicesData.length} services seeded`);
  }

  const projectsData = readJson<any[]>("projects.json");
  if (projectsData.length) {
    await db.insert(projects).values(
      projectsData.map((p) => ({
        caseNo: p.case_no,
        title: p.title,
        description: p.description,
        category: p.category,
        statutes: p.statutes,
        court: p.court,
        outcome: p.outcome,
        createdAt: p.created_at ? new Date(p.created_at) : new Date()
      }))
    );
    console.log(`  ${projectsData.length} projects seeded`);
  }

  const blogData = readJson<any[]>("blog.json");
  if (blogData.length) {
    await db.insert(blogPosts).values(
      blogData.map((b) => ({
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.content,
        publishedAt: b.published_at ? new Date(b.published_at) : new Date()
      }))
    );
    console.log(`  ${blogData.length} blog posts seeded`);
  }

  // Admin login (email + password) — set ADMIN_EMAIL / ADMIN_PASSWORD in .env
  // before seeding. Safe to re-run: skips if that email is already registered.
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.insert(admins).values({ email: adminEmail, passwordHash }).onConflictDoNothing({
      target: admins.email
    });
    console.log(`  admin login seeded (${adminEmail})`);
  } else {
    console.log("  skipped admin login — set ADMIN_EMAIL and ADMIN_PASSWORD in .env to create one");
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
