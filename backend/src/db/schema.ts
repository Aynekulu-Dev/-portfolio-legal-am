import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb
} from "drizzle-orm/pg-core";

// A. profile — owner's core metadata (single-row table)
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  socials: jsonb("socials").$type<Record<string, string>>().default({}),
  location: text("location"),
  yearsExperience: integer("years_experience"),
  focusAreas: jsonb("focus_areas").$type<string[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// B. services — professional service offerings
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon")
});

// C. projects (a.k.a. "cases" in the frontend / CaseFile type) — legal case
// files and research entries. Field names follow /data/projects.json exactly
// so lib/data.ts can be pointed at this API with no shape changes.
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  caseNo: text("case_no"), // e.g. "መዝ.ቁ. 1247/2016" — blank for pure research entries
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'criminal' | 'research'
  statutes: jsonb("statutes").$type<string[]>().default([]),
  court: text("court"),
  outcome: text("outcome"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// D. blog_posts — technical/legal logs and articles
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull()
});

// E'. admins — portfolio owner login (email + hashed password)
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// E. contact_messages — inquiries from site visitors
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
