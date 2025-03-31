import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'rxjs';
import { group } from 'console';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  //* Obtiene todas las notas
  async getAllNotes() {
    try {
      const notes = await this.prisma.note.findMany();
      return notes;

    } catch (error) {
      throw new InternalServerErrorException(
        'Error interno al obtener todas las notas',
      );
    }
  }

  async getNoteById(id: number){
    try{
      if(!id || id <= 0)
      {
        throw new BadRequestException('ID de la nota invalido');
      }

      const note = await this.prisma.note.findUnique({
        where: { id: id },
      });

      return note;

    }catch(error){
      throw new InternalServerErrorException(`Error interno al obtener la nota ${id}`)

    }
  }

  //* Obtiene todas las notas de un grupo por su ID
  async getAllNotesByGroup(idGroup: number) {
    if (!idGroup || idGroup <= 0) {
      throw new BadRequestException('ID del grupo invalido');
    }

    try {
      const allNotes = await this.prisma.note.findMany({
        where: { groupId: idGroup },
      });

      return allNotes;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error interno en obtener las notas del grupo ${idGroup}`,
      );
    }
  }

  //* Obtiene una nota por su ID y el ID del grupo
  async getNoteByGroup(idGroup: number, noteId: number) {
    if (!idGroup || idGroup <= 0) {
      throw new BadRequestException('ID del grupo invalido');
    }

    if (!noteId || noteId <= 0) {
      throw new BadRequestException('ID de la nota invalido');
    }

    try {
      const note = await this.prisma.note.findFirst({
        where: {
          id: noteId,
          groupId: idGroup,
        },
      });

      return note;

    } catch (error) {
      throw new InternalServerErrorException(
        `Error interno al obtener una nota del grupo ${idGroup}`,
      );
    }
  }


  //* Crea una nueva nota
  async createNote(createNoteDto: CreateNoteDto) {

    try {
      const note = {
        title: createNoteDto.title,
        description: createNoteDto.description,
        date: new Date(), 
        groupId: createNoteDto.groupId,
      };

      const createdNote = await this.prisma.note.create({
        data: note,
      });

      return createdNote;

    } catch (error) {
      throw new InternalServerErrorException('Error interno al crear nota');
    }
  }

  //* Actualiza una nota por su ID
  async UpdateNote(updateNoteDto: UpdateNoteDto){
    try {
      const note=await this.prisma.note.update({
        where: {
          id: updateNoteDto.id,
        },
        data:{
          title: updateNoteDto.title,
          description: updateNoteDto.description,
          date: new Date(), // Asigna la fecha actual
          groupId: updateNoteDto.groupId,
        }
      })

      if (!note)
      {
        throw new NotFoundException('Nota invalida');
      }

      return note;

    } catch (error) {
      throw new InternalServerErrorException(`Error interno al editar la nota ${updateNoteDto.id}`)
    }
  }

  //* Elimina una nota por su ID
  async deleteNote(idNote: number) {
    if(!idNote || idNote <=0)
    {
      throw new BadRequestException('ID de la nota invalido')
    }

    try {
      const note= await this.prisma.note.delete({
        where: {id: idNote}
      })
  
      if(!note)
      {
        throw new NotFoundException('Nota no encontrada')
      }

      return note;

    } catch (error) {
      throw new InternalServerErrorException(`Error interno al eliminar la nota ${idNote}`)
    }
    
  }


}
