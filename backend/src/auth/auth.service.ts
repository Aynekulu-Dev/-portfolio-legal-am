import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { DB, Database } from "../db/db.module";
import { admins } from "../db/schema";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

export interface AdminJwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string; email: string }> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const [admin] = await this.db
      .select()
      .from(admins)
      .where(eq(admins.email, normalizedEmail))
      .limit(1);

    // Compare against a dummy hash when no admin is found so the response
    // timing doesn't reveal whether the email exists (basic user enumeration guard).
    const passwordHash = admin?.passwordHash ?? "$2a$10$CwTycUXWue0Thq9StjUM0uJ8y3fT0z9v5X9v5X9v5X9v5X9v5X9vO";
    const passwordMatches = await bcrypt.compare(dto.password, passwordHash);

    if (!admin || !passwordMatches) {
      throw new UnauthorizedException("የተሳሳተ ኢሜይል ወይም የይለፍ ቃል ነው።");
    }

    const payload: AdminJwtPayload = { sub: admin.id, email: admin.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, email: admin.email };
  }

  // Lets the logged-in admin set a new password. Requires the current password
  // (not just a valid JWT) so a leaked/stolen token alone can't take over the
  // account permanently.
  async changePassword(adminId: number, dto: ChangePasswordDto): Promise<{ success: true }> {
    const [admin] = await this.db.select().from(admins).where(eq(admins.id, adminId)).limit(1);

    if (!admin) {
      throw new UnauthorizedException("Admin account not found.");
    }

    const currentMatches = await bcrypt.compare(dto.currentPassword, admin.passwordHash);
    if (!currentMatches) {
      throw new UnauthorizedException("የአሁኑ የይለፍ ቃል ትክክል አይደለም።");
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.db.update(admins).set({ passwordHash: newHash }).where(eq(admins.id, adminId));

    return { success: true };
  }
}
