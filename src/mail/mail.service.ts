import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as path from "path";
import * as fs from "fs/promises";
import { MailerService } from "src/mailer/mailer.service";
import { UserDocument } from "src/users/schemas/user.schema";

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  baseUrl = this.configService.get<string>("API_BASE_URL");
  appName = this.configService.get<string>("APP_NAME");

  async userSignup(user: UserDocument) {
    const filePath = path.join(__dirname, "../../src/mail/mail-templates/activation.hbs");
    const template = await fs.readFile(filePath, "utf-8");
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Confirm your account",
      text: "confirm!!!!",
      template: template,
      context: {
        title: "this is title",
        url: `${this.baseUrl}/v1/auth/verify/email?email=${user.email}&hash=${user.hash}`,
        actionTitle: "Activate",
        app_name: this.appName || "NestJS API",
        text1: "You can click to button below for activating your account",
        text2: "",
        text3: "",
      },
    });
  }
}
