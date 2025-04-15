import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interfaces';
import { UserDocument } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    console.log('🚀 ~ AuthService ~ login ~ expires:', expires);
    let token;
    console.log('🚀 ~ AuthService ~ login ~ tokenPayload:', tokenPayload);
    try {
      token = await this.jwtService.sign(tokenPayload);
    } catch (e) {
      console.log('🚀 ~ AuthService ~ login ~ token:', token, e);
    }

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
