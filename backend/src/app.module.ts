
import { Module } from '@nestjs/common';
import {TasksModule} from './tasks/tasks.module'; 
import { PrismaModule } from './prisma/prisma.module';
import { NotesModule } from './notes/notes.module';


//Se importan los modulos
//Se importan los controladores
@Module({
  imports: [TasksModule, PrismaModule, NotesModule],
  controllers: [],
})
//Se exporta la clase
export class AppModule {}
