import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { SignupDto } from "./dto/signup.dto";
import { Tokens } from "./types/tokens.type";

import { ApiBody, ApiOperation, ApiTags, ApiResponse, ApiQuery } from "@nestjs/swagger";
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
  @Post("signin")
  @ApiOperation({ summary: "User Signin" })
  @ApiResponse({ status: 201, description: "User signed in successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async signin(@Body() siginDto: SigninDto): Promise<Tokens> {
    return await this.authService.validateUser(siginDto);
  }

  @Public()
  @Get("verify/email")
  @ApiOperation({ summary: "Verify account by email" })
  @ApiQuery({ name: "email", description: "Email to verify", type: String, required: true })
  @ApiQuery({ name: "hash", description: "Hash for verification", type: String, required: true })
  @ApiResponse({ status: 200, description: "Success!" })
  @ApiResponse({ status: 400, description: "Invalid action" })
  async verifyEmailPage(@Query() verifyEmailPayload: { email: string; hash: string }) {
    return await this.authService.verifyEmail(verifyEmailPayload);
  }
}
