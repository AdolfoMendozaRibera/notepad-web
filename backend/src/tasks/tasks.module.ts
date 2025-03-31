import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importa el módulo de Prisma

@Module({
  imports: [PrismaModule], // Agrega PrismaModule aquí
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
