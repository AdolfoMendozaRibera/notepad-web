import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class DeleteGroupDto{
    @IsNumber()
    @IsNotEmpty()
    id: number;
}