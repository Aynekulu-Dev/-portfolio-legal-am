import { IsArray, IsInt, IsObject, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(200)
  full_name?: string;

  @IsOptional() @IsString() @MaxLength(200)
  headline?: string;

  @IsOptional() @IsString() @MaxLength(5000)
  bio?: string;

  @IsOptional() @IsString()
  avatar_url?: string;

  @IsOptional() @IsString()
  resume_url?: string;

  @IsOptional() @IsObject()
  socials?: Record<string, string>;

  @IsOptional() @IsString() @MaxLength(200)
  location?: string;

  @IsOptional() @IsInt() @Min(0)
  years_experience?: number;

  @IsOptional() @IsArray()
  focus_areas?: string[];
}
