import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials
   * @param email User email
   * @param password User password (plain text)
   * @returns User object if valid, null otherwise
   */
  async validateUser(email: string, password: string) {
    // Include memberships to get organization
    const user = await this.usersService.findByEmail(email, {
      include: {
        memberships: {
          include: { organization: true },
        },
      },
    });

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return null;
    }

    return user;
  }

  /**
   * Generate JWT and return user info
   * @param user User object
   */
  async login(user: any) {
    // Get organizationId from memberships (first membership)
    const organizationId = user.memberships?.[0]?.organization?.id || null;

    const payload = { sub: user.id, email: user.email };
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

  /**
   * Main login function
   * @param email User email
   * @param password User password
   */
  async loginWithCredentials(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }
}