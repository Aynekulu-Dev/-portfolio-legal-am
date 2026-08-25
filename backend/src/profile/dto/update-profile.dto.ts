import { IsArray, IsInt, IsObject, IsOptional, IsString, MaxLength, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class TimelineItemDto {
  @IsString() @MaxLength(100)
  date!: string;

  @IsString() @MaxLength(200)
  role!: string;

  @IsString() @MaxLength(300)
  org!: string;

  @IsString() @MaxLength(1000)
  detail!: string;
}

class CredentialGroupDto {
  @IsString() @MaxLength(100)
  group!: string;

  @IsArray() @IsString({ each: true })
  items!: string[];
}

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimelineItemDto)
  timeline?: TimelineItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CredentialGroupDto)
  credentials?: CredentialGroupDto[];
}
