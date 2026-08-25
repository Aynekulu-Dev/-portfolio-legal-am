"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactMessages = exports.admins = exports.blogPosts = exports.projects = exports.services = exports.profile = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.profile = (0, pg_core_1.pgTable)("profile", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    fullName: (0, pg_core_1.text)("full_name").notNull(),
    headline: (0, pg_core_1.text)("headline").notNull(),
    bio: (0, pg_core_1.text)("bio").notNull(),
    avatarUrl: (0, pg_core_1.text)("avatar_url"),
    resumeUrl: (0, pg_core_1.text)("resume_url"),
    socials: (0, pg_core_1.jsonb)("socials").$type().default({}),
    location: (0, pg_core_1.text)("location"),
    yearsExperience: (0, pg_core_1.integer)("years_experience"),
    focusAreas: (0, pg_core_1.jsonb)("focus_areas").$type().default([]),
    timeline: (0, pg_core_1.jsonb)("timeline")
        .$type()
        .default([]),
    credentials: (0, pg_core_1.jsonb)("credentials")
        .$type()
        .default([]),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull()
});
exports.services = (0, pg_core_1.pgTable)("services", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    icon: (0, pg_core_1.text)("icon")
});
exports.projects = (0, pg_core_1.pgTable)("projects", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    caseNo: (0, pg_core_1.text)("case_no"),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    category: (0, pg_core_1.text)("category").notNull(),
    statutes: (0, pg_core_1.jsonb)("statutes").$type().default([]),
    court: (0, pg_core_1.text)("court"),
    outcome: (0, pg_core_1.text)("outcome"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull()
});
exports.blogPosts = (0, pg_core_1.pgTable)("blog_posts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    excerpt: (0, pg_core_1.text)("excerpt"),
    content: (0, pg_core_1.text)("content").notNull(),
    publishedAt: (0, pg_core_1.timestamp)("published_at").defaultNow().notNull()
});
exports.admins = (0, pg_core_1.pgTable)("admins", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull()
});
exports.contactMessages = (0, pg_core_1.pgTable)("contact_messages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    senderName: (0, pg_core_1.text)("sender_name").notNull(),
    senderEmail: (0, pg_core_1.text)("sender_email").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    isRead: (0, pg_core_1.boolean)("is_read").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull()
});
//# sourceMappingURL=schema.js.map