import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Handlebars from "handlebars";
import * as nodemailer from "nodemailer";
import { Transporter, SendMailOptions, SentMessageInfo } from "nodemailer";
import fs from "node:fs/promises";

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>("MAIL_HOST"),
      port: configService.get<number>("MAIL_PORT"),
      secure: configService.get<boolean>("MAIL_SECURE"),
      auth: {
        user: configService.get<string>("MAIL_USER"),
        pass: configService.get<string>("MAIL_PASSWORD"),
      },
    });
  }

  async sendMail({
    template,
    context,
    ...mailOptions
  }: SendMailOptions & { template: string; context: Record<string, any> }): Promise<SentMessageInfo> {
    let html: string | undefined;
    html = Handlebars.compile(template, {
            strict: true,
          })(context);

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get("mail.defaultName", {
            infer: true,
          })}" <${this.configService.get("mail.defaultEmail", {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
