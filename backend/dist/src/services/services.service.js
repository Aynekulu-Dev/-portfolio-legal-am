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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_module_1 = require("../db/db.module");
const schema_1 = require("../db/schema");
let ServicesService = class ServicesService {
    constructor(db) {
        this.db = db;
    }
    findAll() {
        return this.db.select().from(schema_1.services);
    }
    async findOne(id) {
        const [row] = await this.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.id, id));
        if (!row)
            throw new common_1.NotFoundException(`Service ${id} not found.`);
        return row;
    }
    async create(dto) {
        const [created] = await this.db.insert(schema_1.services).values(dto).returning();
        return created;
    }
    async update(id, dto) {
        await this.findOne(id);
        const [updated] = await this.db.update(schema_1.services).set(dto).where((0, drizzle_orm_1.eq)(schema_1.services.id, id)).returning();
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.db.delete(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.id, id));
        return { deleted: true };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DB)),
    __metadata("design:paramtypes", [typeof (_a = typeof db_module_1.Database !== "undefined" && db_module_1.Database) === "function" ? _a : Object])
], ServicesService);
//# sourceMappingURL=services.service.js.map