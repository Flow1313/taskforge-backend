import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
  const user = await this.usersService.findByEmail(email, {
    include: {
      memberships: { include: { organization: true } },
    },
  });

  if (!user) throw new UnauthorizedException('Invalid credentials');

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

  const organizationId =
    user.memberships && user.memberships.length > 0
      ? user.memberships[0].organization.id
      : null;

  const payload = {
    sub: user.id,
    email: user.email,
    organizationId,
  };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      organizationId,
    },
  };
  }
}