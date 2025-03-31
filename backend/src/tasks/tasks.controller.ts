import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {ApiTags} from '@nestjs/swagger';
import { query } from 'express';
import { DeleteGroupDto } from './dto/delete-group.dto';

@Controller('/tasks')
@ApiTags('tasks')
export class TasksController {

  constructor(private tasksService: TasksService) {}

  @Get()
  async getAllGroups() { // Mejor nombre en plural para obtener todos los grupos
    return this.tasksService.getAllGroups();
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async getGroup(@Param('id') id: number){
    {
      const numID=Number(id);
      return this.tasksService.getGroup(numID);
    }

  }

  @Post()
  @UsePipes(ValidationPipe) 
  async createGroup(@Body() createGroupDto: CreateGroupDto) { // Usa @Body() para recibir el DTO
    return this.tasksService.createGroup(createGroupDto);
  }

  // Este decorador aplica un pipe de validación a todas las rutas manejadas por este controlador. El ValidationPipe se 
  // utiliza para validar los datos de entrada basados en las clases de DTO (Data Transfer Object) definidas, 
  // asegurando que los datos recibidos cumplen con las reglas de validación especificadas.
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async deleteGroup(@Param('id') id: number){
    return this.tasksService.deleteGroup(Number(id));
  }

  @Patch('')
  @UsePipes(ValidationPipe)
  async updateGroup(@Body() updateGroupDto: UpdateGroupDto){
    return this.tasksService.updateGroup(updateGroupDto);
  }
  
  

}
