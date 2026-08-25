import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { DB, Database } from "../db/db.module";
import { admins } from "../db/schema";
import { LoginDto } from "./dto/login.dto";

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
}
