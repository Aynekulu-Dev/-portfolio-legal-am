import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { asc, eq } from "drizzle-orm";
import { DB, Database } from "../db/db.module";
import { testimonials } from "../db/schema";
import { CreateTestimonialDto, UpdateTestimonialDto } from "./dto/testimonial.dto";

@Injectable()
export class TestimonialsService {
  constructor(@Inject(DB) private readonly db: Database) {}

  findAll() {
    return this.db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
  }

  async findOne(id: number) {
    const [row] = await this.db.select().from(testimonials).where(eq(testimonials.id, id));
    if (!row) throw new NotFoundException(`Testimonial ${id} not found.`);
    return row;
  }

  async create(dto: CreateTestimonialDto) {
    const [created] = await this.db
      .insert(testimonials)
      .values({
        name: dto.name,
        role: dto.role,
        quote: dto.quote,
        avatarUrl: dto.avatar_url,
        sortOrder: dto.sort_order ?? 0
      })
      .returning();
    return created;
  }

  async update(id: number, dto: UpdateTestimonialDto) {
    await this.findOne(id);
    const patch = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.role !== undefined && { role: dto.role }),
      ...(dto.quote !== undefined && { quote: dto.quote }),
      ...(dto.avatar_url !== undefined && { avatarUrl: dto.avatar_url }),
      ...(dto.sort_order !== undefined && { sortOrder: dto.sort_order })
    };
    const [updated] = await this.db
      .update(testimonials)
      .set(patch)
      .where(eq(testimonials.id, id))
      .returning();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(testimonials).where(eq(testimonials.id, id));
    return { deleted: true };
  }
}
