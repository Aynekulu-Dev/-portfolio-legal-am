import { IsArray, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

const CATEGORIES = ["criminal", "civil", "commercial", "research"] as const;

export class CreateProjectDto {
  @IsOptional() @IsString() @MaxLength(100)
  case_no?: string;

  @IsString() @MaxLength(300)
  title!: string;

  @IsString() @MaxLength(5000)
  description!: string;

  @IsIn(CATEGORIES)
  category!: (typeof CATEGORIES)[number];

  @IsOptional() @IsArray()
  statutes?: string[];

  @IsOptional() @IsString() @MaxLength(300)
  court?: string;

  @IsOptional() @IsString() @MaxLength(300)
  outcome?: string;
}

export class UpdateProjectDto {
  @IsOptional() @IsString() @MaxLength(100)
  case_no?: string;

  @IsOptional() @IsString() @MaxLength(300)
  title?: string;

  @IsOptional() @IsString() @MaxLength(5000)
  description?: string;

  @IsOptional() @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];

  @IsOptional() @IsArray()
  statutes?: string[];

  @IsOptional() @IsString() @MaxLength(300)
  court?: string;

  @IsOptional() @IsString() @MaxLength(300)
  outcome?: string;
}
