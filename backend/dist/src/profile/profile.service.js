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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_module_1 = require("../db/db.module");
const schema_1 = require("../db/schema");
let ProfileService = class ProfileService {
    constructor(db) {
        this.db = db;
    }
    async get() {
        const [row] = await this.db.select().from(schema_1.profile).limit(1);
        if (!row)
            throw new common_1.NotFoundException("Profile has not been configured yet.");
        return row;
    }
    async update(dto) {
        const [existing] = await this.db.select().from(schema_1.profile).limit(1);
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
            ...(dto.timeline !== undefined && { timeline: dto.timeline }),
            ...(dto.credentials !== undefined && { credentials: dto.credentials }),
            updatedAt: new Date()
        };
        if (!existing) {
            const [created] = await this.db
                .insert(schema_1.profile)
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
            .update(schema_1.profile)
            .set(patch)
            .where((0, drizzle_orm_1.eq)(schema_1.profile.id, existing.id))
            .returning();
        return updated;
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DB)),
    __metadata("design:paramtypes", [typeof (_a = typeof db_module_1.Database !== "undefined" && db_module_1.Database) === "function" ? _a : Object])
], ProfileService);
//# sourceMappingURL=profile.service.js.map