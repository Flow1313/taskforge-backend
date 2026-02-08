import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [UsersService, PrismaService], // PrismaService needed if UsersService depends on it
  exports: [UsersService],                 // Only export things that are in providers
})
export class UsersModule {}