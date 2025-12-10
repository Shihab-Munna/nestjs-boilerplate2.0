import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ServerConfigService } from '../../server-config/server-config.service';

export interface JwtPayload {
  sub: string; // user id
  email?: string;
  username?: string;
  [key: string]: unknown; // Allow additional claims
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ServerConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      ...payload,
      sub: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}
