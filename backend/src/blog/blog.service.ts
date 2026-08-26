import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { desc, eq, and } from "drizzle-orm";
import { DB, Database } from "../db/db.module";
import { blogPosts } from "../db/schema";
import { CreatePostDto, UpdatePostDto } from "./dto/post.dto";

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // strip anything that isn't ascii alphanumeric (titles are often Amharic)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  // Amharic titles strip down to nothing — fall back to a timestamp-based slug.
  return base || `post-${Date.now()}`;
}

@Injectable()
export class BlogService {
  constructor(@Inject(DB) private readonly db: Database) {}

  // Public listing — published posts only.
  findAll() {
    return this.db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  // Admin listing — everything, including drafts.
  findAllAdmin() {
    return this.db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }

  async findBySlug(slug: string) {
    const [row] = await this.db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)));
    if (!row) throw new NotFoundException(`Post "${slug}" not found.`);
    return row;
  }

  private async findOne(id: number) {
    const [row] = await this.db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (!row) throw new NotFoundException(`Post ${id} not found.`);
    return row;
  }

  async create(dto: CreatePostDto) {
    let slug = dto.slug ? slugify(dto.slug) : slugify(dto.title);

    const [clash] = await this.db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    if (clash) {
      if (dto.slug) throw new ConflictException(`Slug "${slug}" is already in use.`);
      slug = `${slug}-${Date.now()}`; // auto-generated slug: dedupe silently
    }

    const [created] = await this.db
      .insert(blogPosts)
      .values({
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        isPublished: dto.isPublished ?? true
      })
      .returning();
    return created;
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.findOne(id);

    let nextSlug: string | undefined;
    if (dto.slug !== undefined) {
      nextSlug = slugify(dto.slug);
      const [clash] = await this.db.select().from(blogPosts).where(eq(blogPosts.slug, nextSlug));
      if (clash && clash.id !== id) throw new ConflictException(`Slug "${nextSlug}" is already in use.`);
    }

    const patch = {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(nextSlug !== undefined && { slug: nextSlug }),
      ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
      ...(dto.content !== undefined && { content: dto.content }),
      ...(dto.isPublished !== undefined && { isPublished: dto.isPublished })
    };

    const [updated] = await this.db.update(blogPosts).set(patch).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(blogPosts).where(eq(blogPosts.id, id));
    return { deleted: true };
  }
}
