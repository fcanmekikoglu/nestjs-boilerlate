import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SigninDto {
  @ApiProperty({ description: "The email of the user.", example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The password of the user.", example: "Password123+" })
  @IsString()
  password: string;
}
