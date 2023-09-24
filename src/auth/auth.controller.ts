import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { SignupDto } from "./dto/signup.dto";
import { Tokens } from "./types/tokens.type";

import { ApiBody, ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";
import { SigninDto } from "./dto/signin.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  @ApiOperation({ summary: "User Signup" })
  @ApiBody({ type: SignupDto, description: "User registration data" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async signup(@Body() signupDto: SignupDto): Promise<Tokens> {
    return await this.authService.signup(signupDto);
  }

  @Public()
  @Post('signin')
  @ApiOperation({summary:  "User Signin"})
  @ApiResponse({ status: 201, description: "User signed in successfully" })
  @ApiResponse({ status: 400, description: "Bad request"})
  async signin(@Body() siginDto: SigninDto):Promise<Tokens>{
    return await this.authService.validateUser(siginDto)
  }
}
