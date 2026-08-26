import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePostDto {
  @IsString() @MaxLength(300)
  title!: string;

  // Optional — auto-generated from the title if omitted.
  @IsOptional() @IsString() @MaxLength(300)
  slug?: string;

  @IsOptional() @IsString() @MaxLength(500)
  excerpt?: string;

  @IsString()
  content!: string;

  @IsOptional() @IsBoolean()
  isPublished?: boolean;
}

export class UpdatePostDto {
  @IsOptional() @IsString() @MaxLength(300)
  title?: string;

  @IsOptional() @IsString() @MaxLength(300)
  slug?: string;

  @IsOptional() @IsString() @MaxLength(500)
  excerpt?: string;

  @IsOptional() @IsString()
  content?: string;

  @IsOptional() @IsBoolean()
  isPublished?: boolean;
}
