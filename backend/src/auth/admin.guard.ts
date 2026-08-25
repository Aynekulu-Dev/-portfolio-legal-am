import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { AdminJwtPayload } from "./auth.service";

/**
 * Protects admin-only routes (login-issued JWT required). Send:
 * Authorization: Bearer <accessToken returned by POST /auth/login>
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token.");
    }

    const token = authHeader.slice("Bearer ".length).trim();

    try {
      const payload = await this.jwtService.verifyAsync<AdminJwtPayload>(token);
      request.admin = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token.");
    }
  }
}
