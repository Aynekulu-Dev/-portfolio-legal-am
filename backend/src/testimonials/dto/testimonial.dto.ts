import { IsInt, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateTestimonialDto {
  @IsString() @MaxLength(200)
  name!: string;

  @IsOptional() @IsString() @MaxLength(200)
  role?: string;

  @IsString() @MaxLength(1000)
  quote!: string;

  @IsOptional() @IsString()
  avatar_url?: string;

  @IsOptional() @IsInt()
  sort_order?: number;
}

export class UpdateTestimonialDto {
  @IsOptional() @IsString() @MaxLength(200)
  name?: string;

  @IsOptional() @IsString() @MaxLength(200)
  role?: string;

  @IsOptional() @IsString() @MaxLength(1000)
  quote?: string;

  @IsOptional() @IsString()
  avatar_url?: string;

  @IsOptional() @IsInt()
  sort_order?: number;
}
