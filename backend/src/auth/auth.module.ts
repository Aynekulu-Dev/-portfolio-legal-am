import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { AdminGuard } from "./admin.guard";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

const JwtAuthModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): JwtModuleOptions => {
    const secret = config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("JWT_SECRET is not set. Copy .env.example to .env and configure it.");
    }
    const expiresIn = config.get<string>("JWT_EXPIRES_IN", "7d");
    return {
      secret,
      signOptions: { expiresIn } as JwtModuleOptions["signOptions"]
    };
  }
});

@Global()
@Module({
  imports: [JwtAuthModule],
  controllers: [AuthController],
  providers: [AdminGuard, AuthService],
  // Re-export JwtModule too: AdminGuard/AuthService need JwtService, and since
  // this module is @Global(), re-exporting it makes JwtService resolvable from
  // *every* other module — not just the ones that happen to import AuthModule
  // directly. Without this, @UseGuards(AdminGuard) in other modules (Profile,
  // Services, Projects, Blog, Contact) fails to resolve AdminGuard's own
  // JwtService dependency.
  exports: [AdminGuard, JwtAuthModule]
})
export class AuthModule {}