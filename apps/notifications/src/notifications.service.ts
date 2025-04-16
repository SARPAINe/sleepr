import { Inject, Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('TRANSPORTER') private readonly transporter,
  ) {}

  async notifyEmail({ email, text }: NotifyEmailDto) {
    console.log(email);
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Sleepr Notification',
      text: text,
    });
  }
}
