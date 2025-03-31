import {IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";


export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    description: string

    @IsNumber()
    @IsNotEmpty()
    groupId: number;
}
