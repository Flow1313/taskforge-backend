import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: {
    email: string;
    password: string;
    name: string;
    organizationId: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        memberships: {
          create: {
            organizationId: data.organizationId,
          },
        },
      },
    });
  }

  async findByEmail(email: string, includeOptions?: any) {
  return this.prisma.user.findUnique({
    where: { email },
    ...includeOptions, // spread optional include if provided
  });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findProfileByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });
}
}
