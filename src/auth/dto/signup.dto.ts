import { IsEmail, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({ description: "The email of the user.", example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of the user.",
    example: "Password123+",
    minLength: 8,
    pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/",
    type: String,
  })
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1 })
  password: string;
}
