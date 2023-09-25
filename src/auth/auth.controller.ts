import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { SignupDto } from "./dto/signup.dto";
import { Tokens } from "./types/tokens.type";

import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetCurrentUser } from "./decorators/get-current-user.decorator";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SigninDto } from "./dto/signin.dto";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";

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

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Get("refresh")
  async refresh(@GetCurrentUser() user: Record<string, any>): Promise<Tokens> {
    const { email, refreshToken } = user;
    return await this.authService.refresh(email, refreshToken);
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

  @Public()
  @Post("password/forgot")
  @ApiOperation({ summary: "Send token for resetting password" })
  @ApiBody({ type: ForgotPasswordDto, description: "Forgot password data" })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post("password/reset")
  @ApiOperation({ summary: "Send new password for resetting password" })
  @ApiBody({ type: ResetPasswordDto, description: "Reset password data" })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
