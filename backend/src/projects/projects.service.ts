import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import { DB, Database } from "../db/db.module";
import { projects } from "../db/schema";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";

@Injectable()
export class ProjectsService {
  constructor(@Inject(DB) private readonly db: Database) {}

  findAll(category?: "criminal" | "civil" | "commercial" | "research") {
    const query = this.db.select().from(projects).orderBy(desc(projects.createdAt));
    if (category) {
      return this.db
        .select()
        .from(projects)
        .where(eq(projects.category, category))
        .orderBy(desc(projects.createdAt));
    }
    return query;
  }

  async findOne(id: number) {
    const [row] = await this.db.select().from(projects).where(eq(projects.id, id));
    if (!row) throw new NotFoundException(`Project ${id} not found.`);
    return row;
  }

  async create(dto: CreateProjectDto) {
    const [created] = await this.db
      .insert(projects)
      .values({
        caseNo: dto.case_no,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        statutes: dto.statutes ?? [],
        court: dto.court,
        outcome: dto.outcome
      })
      .returning();
    return created;
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id);
    const patch = {
      ...(dto.case_no !== undefined && { caseNo: dto.case_no }),
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.statutes !== undefined && { statutes: dto.statutes }),
      ...(dto.court !== undefined && { court: dto.court }),
      ...(dto.outcome !== undefined && { outcome: dto.outcome })
    };
    const [updated] = await this.db.update(projects).set(patch).where(eq(projects.id, id)).returning();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(projects).where(eq(projects.id, id));
    return { deleted: true };
  }
}
