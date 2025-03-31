import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}

