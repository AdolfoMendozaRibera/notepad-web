import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsNumber, IsString, MinLength, Min, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) para actualizar un grupo.
 * 
 * Esta clase extiende de `PartialType(CreateGroupDto)`, lo que significa que 
 * hereda todas las propiedades de `CreateGroupDto` pero las hace opcionales.
 * 
 * Propiedades:
 * - `title`: El título del grupo. Debe ser una cadena de texto con una longitud mínima de 1.
 */
export class UpdateGroupDto extends PartialType(CreateGroupDto) {

    @IsNumber()
    @IsNotEmpty()
    id: number;

    //Ya no es necesario colocar, porque el PartialType hereda las propiedades
    /*
    @IsString()
    @MinLength(1)
    title: string;
    */
}
