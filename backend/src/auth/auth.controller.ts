import { Body, Controller, Get, HttpCode, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AdminGuard } from "./admin.guard";
import type { AdminJwtPayload } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login is public but tightly rate-limited to slow down credential guessing.
  @Post("login")
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Used by the frontend to check whether a stored token is still valid.
  @Get("me")
  @UseGuards(AdminGuard)
  me(@Req() req: Request & { admin: AdminJwtPayload }) {
    return { email: req.admin.email };
  }

  // Logged-in admin changes their own password. Requires the current password
  // in the body, not just a valid JWT — see AuthService.changePassword for why.
  @Patch("change-password")
  @HttpCode(200)
  @UseGuards(AdminGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  changePassword(
    @Req() req: Request & { admin: AdminJwtPayload },
    @Body() dto: ChangePasswordDto
  ) {
    return this.authService.changePassword(req.admin.sub, dto);
  }
}
