import { Module } from "@nestjs/common";
import { ForgotService } from "./forgot.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Forgot, ForgotSchema } from "./schemas/forgot.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Forgot.name,
        schema: ForgotSchema,
      },
    ]),
  ],
  providers: [ForgotService],
  exports: [ForgotService],
})
export class ForgotModule {}
