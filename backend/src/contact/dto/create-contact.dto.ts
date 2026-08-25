import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

// Field names match exactly what ContactForm.tsx sends:
// { sender_name, sender_email, message }
export class CreateContactDto {
  @IsString() @MinLength(1) @MaxLength(200)
  sender_name!: string;

  @IsEmail()
  @MaxLength(320)
  sender_email!: string;

  @IsString() @MinLength(10) @MaxLength(5000)
  message!: string;
}
