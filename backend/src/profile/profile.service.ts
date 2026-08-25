import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB, Database } from "../db/db.module";
import { profile } from "../db/schema";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfileService {
  constructor(@Inject(DB) private readonly db: Database) {}

  async get() {
    const [row] = await this.db.select().from(profile).limit(1);
    if (!row) throw new NotFoundException("Profile has not been configured yet.");
    return row;
  }

  async update(dto: UpdateProfileDto) {
    const [existing] = await this.db.select().from(profile).limit(1);

    const patch = {
      ...(dto.full_name !== undefined && { fullName: dto.full_name }),
      ...(dto.headline !== undefined && { headline: dto.headline }),
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.avatar_url !== undefined && { avatarUrl: dto.avatar_url }),
      ...(dto.resume_url !== undefined && { resumeUrl: dto.resume_url }),
      ...(dto.socials !== undefined && { socials: dto.socials }),
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.years_experience !== undefined && { yearsExperience: dto.years_experience }),
      ...(dto.focus_areas !== undefined && { focusAreas: dto.focus_areas }),
      updatedAt: new Date()
    };

    if (!existing) {
      const [created] = await this.db
        .insert(profile)
        .values({
          fullName: dto.full_name ?? "",
          headline: dto.headline ?? "",
          bio: dto.bio ?? "",
          ...patch
        })
        .returning();
      return created;
    }

    const [updated] = await this.db
      .update(profile)
      .set(patch)
      .where(eq(profile.id, existing.id))
      .returning();
    return updated;
  }
}
