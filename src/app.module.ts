import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenGuard } from "./auth/guards/access-token.guard";
import { RolesGuard } from "./auth/guards/roles.guard";
import { MailModule } from "./mail/mail.module";
import { MailerModule } from "./mailer/mailer.module";
import { ForgotModule } from './forgot/forgot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MailModule,
    MailerModule,
    ForgotModule,
  ],
  controllers: [],
  providers: [
    { provide: "APP_GUARD", useClass: AccessTokenGuard },
    { provide: "APP_GUARD", useClass: RolesGuard },
  ],
})
export class AppModule {}
