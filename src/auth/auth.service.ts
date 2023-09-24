import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { Tokens } from "./types/tokens.type";
import { SignupDto } from "./dto/signup.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from "src/users/schemas/user.schema";
import { JWT_CONSTANTS } from "./constants";
import { SigninDto } from "./dto/signin.dto";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  
  public async signup(signupDto: SignupDto): Promise<Tokens> {
    const { email, password } = signupDto;

    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      this.logger.debug("User tried to signup with a used email address");
      throw new BadRequestException("Try different e-mail address");
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.createUser(email, hashedPassword);

    this.logger.debug(`User with email ${email} signed up successfully.`);

    const tokens = await this.signTokens(newUser);
    const { accessToken, refreshToken } = tokens;

    const hashedToken = await this.hashToken(refreshToken);

    newUser.hash = hashedToken;
    await this.mailService.userSignup(newUser);

    await newUser.save();

    return { accessToken, refreshToken };
  }

  public async validateUser(signinDto: SigninDto): Promise<Tokens> {
    this.logger.debug(`Validate user request: ${signinDto.email}`);
    const { email, password } = signinDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      this.logger.debug(`Validate user request: ${signinDto.email} but e-mail not found`);
      throw new BadRequestException("E-mail not found");
    }

    const isPasswordMatch = await this.compareHashes(password, user.password);

    if (!isPasswordMatch) {
      this.logger.debug(`Validate user request: ${signinDto.email} but password is wrong`);
      throw new BadRequestException("Password not valid");
    }
    this.logger.debug(`Validated user successfully: ${signinDto.email}`);

    const tokens = await this.signTokens(user);
    const { accessToken, refreshToken } = tokens;

    const hashedToken = await this.hashToken(refreshToken);
    user.hash = hashedToken;
    await user.save();

    return { accessToken, refreshToken };
  }

  async verifyEmail(verifyAccountByEmailPayload: { email: string; hash: string }) {
    try {
      const user: UserDocument = await this.userService.findUserByEmail(verifyAccountByEmailPayload.email);
      if (!user) throw new Error();
      if (user.hash != verifyAccountByEmailPayload.hash) throw new Error();
      user.isEmailVerified = true;
      await user.save();
      return "Success! Account verified now, you need to login.";
    } catch (error) {
      return "Invalid action";
    }
  }

  // Utils
  private async signTokens(user: UserDocument): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, email: user.email, roles: user.roles, isEmailVerified: user.isEmailVerified },
        { secret: JWT_CONSTANTS.ACCESS_TOKEN_SECRET, expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN },
      ),
      this.jwtService.signAsync(
        { sub: user.id, email: user.email, roles: user.roles, isEmailVerified: user.isEmailVerified },
        { secret: JWT_CONSTANTS.REFRESH_TOKEN_SECRET, expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN },
      ),
    ]);
    return { accessToken, refreshToken };
  }
  
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }

  private async compareHashes(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
