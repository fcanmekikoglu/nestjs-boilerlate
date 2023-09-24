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
        url: "http://localhost:3000/v1/users/me",
        actionTitle: "this is action Title",
        app_name: "api app title",
        text1: "1asasf",
        text2: "2asdfasf",
        text3: "sdjsdg",
      },
    });
  }
}
