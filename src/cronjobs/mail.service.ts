import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configure your email provider settings here
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, message: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'amanymounas@gmail.com',
      to,
      subject,
      text: message,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
