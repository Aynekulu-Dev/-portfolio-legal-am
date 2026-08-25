"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    const corsOrigin = config.get("CORS_ORIGIN", "*");
    app.enableCors({
        origin: corsOrigin === "*" ? true : corsOrigin.split(",").map((o) => o.trim()),
        methods: ["GET", "POST", "PATCH", "DELETE"]
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    const port = config.get("PORT", 4000);
    await app.listen(port);
    console.log(`Portfolio backend listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map