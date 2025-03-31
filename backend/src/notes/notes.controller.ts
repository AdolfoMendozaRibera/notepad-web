import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiTags } from '@nestjs/swagger';

//* El decorador @Controller se utiliza para definir un controlador en NestJS. Un controlador es responsable de manejar las solicitudes HTTP y devolver respuestas. En este caso, el controlador se llama NotesController y maneja las rutas relacionadas con las notas.
@Controller('/notes')
//* Este decorador se utiliza para definir la ruta base del controlador. En este caso, todas las rutas definidas en este controlador comenzarán con '/notes'.
@ApiTags('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  

  @Get()
  async getAllNotes(){
    return this.notesService.getAllNotes();
  }
  
  @Post()
  @UsePipes(ValidationPipe)
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.createNote(createNoteDto);
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async getNoteById(@Param('id') id: number){
    return this.notesService.getNoteById(Number(id));
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async deleteNote(@Param('id') id:number){
    return this.notesService.deleteNote(Number(id));
  }

  @Patch('')
  @UsePipes(ValidationPipe)
  async updateNote(@Body() updateNoteDto: UpdateNoteDto){
    return this.notesService.UpdateNote(updateNoteDto);
  }
}
