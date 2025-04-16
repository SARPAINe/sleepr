import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';

import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export const TransporterProvider = {
  provide: 'TRANSPORTER',
  useFactory: (configService: ConfigService) => {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: configService.get('SMTP_USER'),
        clientId: configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
        refreshToken: configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
      },
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, TransporterProvider],
})
export class NotificationsModule {}
