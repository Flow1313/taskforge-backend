import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    if (!data) {
      throw new BadRequestException('Request body missing');
    }

    const { email, password, name } = data;

    if (!email || !password || !name) {
      throw new BadRequestException('Missing required fields');
    }

    return this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }
}