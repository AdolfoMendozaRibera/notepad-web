import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from '../prisma/prisma.service';
import { title } from 'process';
import { DeleteGroupDto } from './dto/delete-group.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAllGroups() {
    try {
      const groups = await this.prisma.group.findMany({
        include: {
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });

      if (!groups || groups.length === 0) {
        throw new NotFoundException('No existen grupos');
      }
      return groups;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al obtener grupos');
    }
  }

  async getGroup(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('No se puede obtener grupo sin ID');
    }

    console.log(id);
    try {
      const group = await this.prisma.group.findUnique({
        where: { id },
      });

      if (!group) {
        throw new NotFoundException('No existe el grupo');
      }

      return group;
    } catch (error) {
      console.error('ERROR DETALLADO: ', error);
      throw new InternalServerErrorException('Error interno al obtener grupo');
    }
  }

  async createGroup(createGroupDto: CreateGroupDto) {
    if (!createGroupDto || !createGroupDto.title) {
      throw new BadRequestException('No se puede crear grupo sin titulo');
    }

    try {
      return await this.prisma.group.create({
        data: {
          title: createGroupDto.title,
        },
      });
    } catch (error) {
      console.error('Error al crear grupo:', error);
      throw new InternalServerErrorException('Error interno al crear grupo');
    }
  }

  async updateGroup(updateGroupDto: UpdateGroupDto) {
    if (!updateGroupDto || !updateGroupDto.title || !updateGroupDto.id) {
      throw new BadRequestException(
        'No se puede actualizar el grupo sin título o sin id',
      );
    }

    try {
      const group = await this.prisma.group.update({
        where: { id: updateGroupDto.id },
        data: {
          title: updateGroupDto.title,
        },
      });

      if (!group) {
        throw new NotFoundException('Grupo no encontrado');
      }

      return group;
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
      throw new InternalServerErrorException(
        'Error interno al actualizar grupo',
      );
    }
  }

  async deleteGroup(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('No se puede eliminar el grupo sin ID');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Primero eliminar todas las notas del grupo
        await prisma.note.deleteMany({
          where: { groupId: id },
        });

        // Luego eliminar el grupo
        const deletedGroup = await prisma.group.delete({
          where: { id },
        });

        if (!deletedGroup) {
          throw new NotFoundException('Grupo no encontrado');
        }

        return deletedGroup;
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error al eliminar el grupo:', error);
      throw new InternalServerErrorException('Error interno al eliminar grupo');
    }
  }
}
