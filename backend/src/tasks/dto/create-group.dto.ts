import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateGroupDto {
    @IsString()
    @IsNotEmpty()
    title: string
}