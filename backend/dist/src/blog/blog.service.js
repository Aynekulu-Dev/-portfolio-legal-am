"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_module_1 = require("../db/db.module");
const schema_1 = require("../db/schema");
function slugify(input) {
    const base = input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    return base || `post-${Date.now()}`;
}
let BlogService = class BlogService {
    constructor(db) {
        this.db = db;
    }
    findAll() {
        return this.db.select().from(schema_1.blogPosts).orderBy((0, drizzle_orm_1.desc)(schema_1.blogPosts.publishedAt));
    }
    async findBySlug(slug) {
        const [row] = await this.db.select().from(schema_1.blogPosts).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.slug, slug));
        if (!row)
            throw new common_1.NotFoundException(`Post "${slug}" not found.`);
        return row;
    }
    async findOne(id) {
        const [row] = await this.db.select().from(schema_1.blogPosts).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.id, id));
        if (!row)
            throw new common_1.NotFoundException(`Post ${id} not found.`);
        return row;
    }
    async create(dto) {
        let slug = dto.slug ? slugify(dto.slug) : slugify(dto.title);
        const [clash] = await this.db.select().from(schema_1.blogPosts).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.slug, slug));
        if (clash) {
            if (dto.slug)
                throw new common_1.ConflictException(`Slug "${slug}" is already in use.`);
            slug = `${slug}-${Date.now()}`;
        }
        const [created] = await this.db
            .insert(schema_1.blogPosts)
            .values({ title: dto.title, slug, excerpt: dto.excerpt, content: dto.content })
            .returning();
        return created;
    }
    async update(id, dto) {
        await this.findOne(id);
        let nextSlug;
        if (dto.slug !== undefined) {
            nextSlug = slugify(dto.slug);
            const [clash] = await this.db.select().from(schema_1.blogPosts).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.slug, nextSlug));
            if (clash && clash.id !== id)
                throw new common_1.ConflictException(`Slug "${nextSlug}" is already in use.`);
        }
        const patch = {
            ...(dto.title !== undefined && { title: dto.title }),
            ...(nextSlug !== undefined && { slug: nextSlug }),
            ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
            ...(dto.content !== undefined && { content: dto.content })
        };
        const [updated] = await this.db.update(schema_1.blogPosts).set(patch).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.id, id)).returning();
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.db.delete(schema_1.blogPosts).where((0, drizzle_orm_1.eq)(schema_1.blogPosts.id, id));
        return { deleted: true };
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DB)),
    __metadata("design:paramtypes", [typeof (_a = typeof db_module_1.Database !== "undefined" && db_module_1.Database) === "function" ? _a : Object])
], BlogService);
//# sourceMappingURL=blog.service.js.map