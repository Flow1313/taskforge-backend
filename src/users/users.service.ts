import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new user
  async createUser(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({ data });
  }

  // Find user by email, optionally including memberships & organization
  async findByEmail(
    email: string,
    options?: { include?: any },
  ): Promise<(User & { memberships?: any[] }) | null> {
    return this.prisma.user.findUnique({
      where: { email },
      ...options,
    });
  }
}