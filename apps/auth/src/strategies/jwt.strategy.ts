import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          console.log(
            '🚀 ~ JwtStrategy ~ classJwtStrategyextendsPassportStrategy ~ req.cookies?.Authentication:',
            req?.Authentication,
          );
          return req?.cookies?.Authentication || req?.Authentication;
        },
      ]),
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        (() => {
          throw new Error('JWT_SECRET is not defined');
        })(),
    });
  }

  async validate({ userId }: TokenPayload) {
    console.log('🚀 ~ JwtStrategy ~ validate ~ TokenPayload:', userId);
    return this.usersService.getUser({ _id: userId });
  }
}
