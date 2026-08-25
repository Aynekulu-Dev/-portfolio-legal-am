import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateServiceDto {
  @IsString() @MaxLength(200)
  title!: string;

  @IsString() @MaxLength(2000)
  description!: string;

  @IsOptional() @IsString() @MaxLength(100)
  icon?: string;
}

export class UpdateServiceDto {
  @IsOptional() @IsString() @MaxLength(200)
  title?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  description?: string;

  @IsOptional() @IsString() @MaxLength(100)
  icon?: string;
}
