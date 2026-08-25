import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB, Database } from "../db/db.module";
import { services } from "../db/schema";
import { CreateServiceDto, UpdateServiceDto } from "./dto/service.dto";

@Injectable()
export class ServicesService {
  constructor(@Inject(DB) private readonly db: Database) {}

  findAll() {
    return this.db.select().from(services);
  }

  async findOne(id: number) {
    const [row] = await this.db.select().from(services).where(eq(services.id, id));
    if (!row) throw new NotFoundException(`Service ${id} not found.`);
    return row;
  }

  async create(dto: CreateServiceDto) {
    const [created] = await this.db.insert(services).values(dto).returning();
    return created;
  }

  async update(id: number, dto: UpdateServiceDto) {
    await this.findOne(id);
    const [updated] = await this.db.update(services).set(dto).where(eq(services.id, id)).returning();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(services).where(eq(services.id, id));
    return { deleted: true };
  }
}
