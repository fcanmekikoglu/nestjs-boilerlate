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

  /**
   * Handles user signup and token generation.
   *
   * @async
   * @param {SignupDto} signupDto - Data transfer object containing the user's email and password.
   * @returns {Promise<Tokens>} An object containing the accessToken and refreshToken for the signed-up user.
   * @throws {BadRequestException} Throws an exception if the email is already in use.
   *
   * @example
   * const signupData = {
   *   email: "example@example.com",
   *   password: "Password123+"
   * };
   * const tokens = await signup(signupData);
   * console.log(tokens.accessToken);  // Logs the access token
   *
   * @memberof [AuthService]
   */
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

  /**
   * Validates the user's email and password, and if successful, generates access and refresh tokens.
   *
   * @async
   * @param {SigninDto} signinDto - Data transfer object containing the user's email and password for validation.
   * @returns {Promise<Tokens>} An object containing the accessToken and refreshToken for the validated user.
   * @throws {BadRequestException} Throws an exception if the email is not found or the password is invalid.
   *
   * @example
   * const signinData = {
   *   email: "example@example.com",
   *   password: "Password123+"
   * };
   * const tokens = await validateUser(signinData);
   * console.log(tokens.accessToken);  // Logs the access token
   *
   * @memberof [AuthService]
   */
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

  /**
   * Verifies the email of a user based on provided email and hash.
   *
   * @async
   * @param {Object} verifyAccountByEmailPayload - The payload for email verification.
   * @param {string} verifyAccountByEmailPayload.email - The email address of the user.
   * @param {string} verifyAccountByEmailPayload.hash - The hash associated with the email verification.
   *
   * @returns {Promise<string>} Returns a success message if the verification is successful;
   * otherwise, returns an 'Invalid action' message.
   *
   * @throws Will return 'Invalid action' for any error during the verification process.
   *
   * @example
   * const response = await verifyEmail({ email: 'user@example.com', hash: 'abcd1234' });
   * console.log(response); // "Success! Account verified" or "Invalid action"
   */
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

  /**
   * Generates access and refresh tokens for the given user.
   *
   * @async
   * @private
   * @param {UserDocument} user - The user document for which the tokens need to be generated.
   * @returns {Promise<Tokens>} An object containing the generated accessToken and refreshToken.
   *
   * @example
   * const userDocument = {
   *   id: "123456",
   *   email: "example@example.com",
   *   roles: ["admin"]
   * };
   * const tokens = await signTokens(userDocument);
   * console.log(tokens.accessToken);  // Logs the generated access token
   *
   * @memberof [AuthService]
   */
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

  /**
   * Hashes the given password using bcrypt.
   *
   * @async
   * @private
   * @param {string} password - The password to be hashed.
   * @returns {Promise<string>} The hashed password.
   *
   * @example
   * const hashedPassword = await hashPassword("myPassword123");
   * console.log(hashedPassword);  // Logs the hashed password
   *
   * @memberof [AuthService]
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Hashes the given token using bcrypt.
   *
   * @async
   * @private
   * @param {string} token - The token to be hashed.
   * @returns {Promise<string>} The hashed token.
   *
   * @example
   * const hashedToken = await hashToken("myToken123");
   * console.log(hashedToken);  // Logs the hashed token
   *
   * @memberof [AuthService]
   */
  private async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }

  /**
   * Compares a plain text string to a hashed string to determine if they match.
   *
   * @async
   * @private
   * @param {string} plainText - The plain text string to compare.
   * @param {string} hash - The hashed string to compare against.
   * @returns {Promise<boolean>} True if the plain text matches the hash, otherwise false.
   *
   * @example
   * const isMatch = await compareHashes("myPassword123", "hashedValue");
   * console.log(isMatch);  // Logs true or false
   *
   * @memberof [AuthService]
   */
  private async compareHashes(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
