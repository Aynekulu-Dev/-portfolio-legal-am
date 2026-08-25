"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const serverless_1 = require("@neondatabase/serverless");
const neon_http_1 = require("drizzle-orm/neon-http");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const bcrypt = __importStar(require("bcryptjs"));
const schema_1 = require("./schema");
const DATA_DIR = process.env.FRONTEND_DATA_DIR || path.join(__dirname, "../../../portfolio/data");
function readJson(file) {
    const full = path.join(DATA_DIR, file);
    return JSON.parse(fs.readFileSync(full, "utf-8"));
}
async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString)
        throw new Error("DATABASE_URL is not set");
    const sql = (0, serverless_1.neon)(connectionString);
    const db = (0, neon_http_1.drizzle)(sql);
    console.log(`Seeding from ${DATA_DIR} ...`);
    const profileData = readJson("profile.json");
    await db.insert(schema_1.profile).values({
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
    const servicesData = readJson("services.json");
    if (servicesData.length) {
        await db.insert(schema_1.services).values(servicesData.map((s) => ({ title: s.title, description: s.description, icon: s.icon })));
        console.log(`  ${servicesData.length} services seeded`);
    }
    const projectsData = readJson("projects.json");
    if (projectsData.length) {
        await db.insert(schema_1.projects).values(projectsData.map((p) => ({
            caseNo: p.case_no,
            title: p.title,
            description: p.description,
            category: p.category,
            statutes: p.statutes,
            court: p.court,
            outcome: p.outcome,
            createdAt: p.created_at ? new Date(p.created_at) : new Date()
        })));
        console.log(`  ${projectsData.length} projects seeded`);
    }
    const blogData = readJson("blog.json");
    if (blogData.length) {
        await db.insert(schema_1.blogPosts).values(blogData.map((b) => ({
            title: b.title,
            slug: b.slug,
            excerpt: b.excerpt,
            content: b.content,
            publishedAt: b.published_at ? new Date(b.published_at) : new Date()
        })));
        console.log(`  ${blogData.length} blog posts seeded`);
    }
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await db.insert(schema_1.admins).values({ email: adminEmail, passwordHash }).onConflictDoNothing({
            target: schema_1.admins.email
        });
        console.log(`  admin login seeded (${adminEmail})`);
    }
    else {
        console.log("  skipped admin login — set ADMIN_EMAIL and ADMIN_PASSWORD in .env to create one");
    }
    console.log("Seed complete.");
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed-http.js.map