import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'; 
import { PrismaClient } from '@prisma/client'; 

// Marca la clase como un servicio que puede ser inyectado en otros componentes
@Injectable()
// Crea un servicio que extiende las funcionalidades del cliente de Prisma
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Método que se ejecuta automáticamente cuando el módulo se inicializa
  async onModuleInit() {
    // Conecta el cliente de Prisma a la base de datos al iniciar el módulo
    await this.$connect();
  }

  // Método que se ejecuta automáticamente cuando el módulo se destruye (al finalizar la aplicación)
  async onModuleDestroy() {
    // Desconecta el cliente de Prisma de la base de datos al finalizar el módulo
    await this.$disconnect();
  }
}