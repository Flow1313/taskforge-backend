import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string, // must be string
    });
  }

  async validate(payload: any) {
    // Payload contains what you signed in AuthService (userId, email, organizationId)
    return { userId: payload.sub, email: payload.email, organizationId: payload.organizationId };
  }
}