import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenGuard } from "./auth/guards/access-token.guard";
import { RolesGuard } from "./auth/guards/roles.guard";

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
  ],
  controllers: [AppController],
  providers: [AppService, { provide: "APP_GUARD", useClass: AccessTokenGuard }, { provide: "APP_GUARD", useClass: RolesGuard }],
})
export class AppModule {}
