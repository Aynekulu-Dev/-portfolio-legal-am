import { IsString, MinLength, MaxLength } from "class-validator";

export class ChangePasswordDto {
  @IsString() @MinLength(1) @MaxLength(200)
  currentPassword!: string;

  // 8-char floor is a reasonable minimum for an admin-only account; raise this
  // if you want to enforce a stronger policy (e.g. 12+ with complexity rules).
  @IsString() @MinLength(8) @MaxLength(200)
  newPassword!: string;
}
