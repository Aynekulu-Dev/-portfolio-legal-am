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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = __importStar(require("bcryptjs"));
const db_module_1 = require("../db/db.module");
const schema_1 = require("../db/schema");
let AuthService = class AuthService {
    constructor(db, jwtService) {
        this.db = db;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const [admin] = await this.db
            .select()
            .from(schema_1.admins)
            .where((0, drizzle_orm_1.eq)(schema_1.admins.email, normalizedEmail))
            .limit(1);
        const passwordHash = admin?.passwordHash ?? "$2a$10$CwTycUXWue0Thq9StjUM0uJ8y3fT0z9v5X9v5X9v5X9v5X9v5X9vO";
        const passwordMatches = await bcrypt.compare(dto.password, passwordHash);
        if (!admin || !passwordMatches) {
            throw new common_1.UnauthorizedException("የተሳሳተ ኢሜይል ወይም የይለፍ ቃል ነው።");
        }
        const payload = { sub: admin.id, email: admin.email };
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken, email: admin.email };
    }
    async changePassword(adminId, dto) {
        const [admin] = await this.db.select().from(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.id, adminId)).limit(1);
        if (!admin) {
            throw new common_1.UnauthorizedException("Admin account not found.");
        }
        const currentMatches = await bcrypt.compare(dto.currentPassword, admin.passwordHash);
        if (!currentMatches) {
            throw new common_1.UnauthorizedException("የአሁኑ የይለፍ ቃል ትክክል አይደለም።");
        }
        const newHash = await bcrypt.hash(dto.newPassword, 10);
        await this.db.update(schema_1.admins).set({ passwordHash: newHash }).where((0, drizzle_orm_1.eq)(schema_1.admins.id, adminId));
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DB)),
    __metadata("design:paramtypes", [typeof (_a = typeof db_module_1.Database !== "undefined" && db_module_1.Database) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map