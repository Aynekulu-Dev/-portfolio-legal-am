"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const admin_guard_1 = require("./admin.guard");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const JwtAuthModule = jwt_1.JwtModule.registerAsync({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (config) => {
        const secret = config.get("JWT_SECRET");
        if (!secret) {
            throw new Error("JWT_SECRET is not set. Copy .env.example to .env and configure it.");
        }
        const expiresIn = config.get("JWT_EXPIRES_IN", "7d");
        return {
            secret,
            signOptions: { expiresIn }
        };
    }
});
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [JwtAuthModule],
        controllers: [auth_controller_1.AuthController],
        providers: [admin_guard_1.AdminGuard, auth_service_1.AuthService],
        exports: [admin_guard_1.AdminGuard, JwtAuthModule]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map