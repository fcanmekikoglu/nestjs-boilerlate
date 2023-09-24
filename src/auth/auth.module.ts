import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { UsersModule } from "src/users/users.module";
import { MailModule } from "src/mail/mail.module";
import { ForgotModule } from "src/forgot/forgot.module";

@Module({
  imports: [JwtModule.register({}), UsersModule, MailModule, ForgotModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
