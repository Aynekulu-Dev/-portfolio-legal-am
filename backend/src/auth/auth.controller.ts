import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
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
}
