import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const { email, password, name } = dto;

    // 1️⃣ Check for duplicate email
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Transaction: user + org + membership
    return this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      // Create default organization
      const organization = await tx.organization.create({
        data: {
          name: `${name}'s Organization`,
        },
      });

      // Create membership (OWNER)
      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: 'OWNER',
        },
      });

      // Remove password from response
      const { password: _, ...safeUser } = user;

      return {
        ...safeUser,
        organizationId: organization.id,
      };
    });
  }
}