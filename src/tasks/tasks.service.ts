import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  createTask(
    organizationId: string,
    userId: string,
    dto: CreateTaskDto,
  ) {
    return this.prisma.task.create({
      data: {
        ...dto,
        organizationId,
        createdById: userId,
      },
    });
  }

  getTasksByOrganization(organizationId: string) {
    return this.prisma.task.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateTask(taskId: string, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: dto,
    });
  }

  deleteTask(taskId: string) {
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}