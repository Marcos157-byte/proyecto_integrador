import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTallaDto {
    @IsString()
    @MaxLength(10)
    @IsNotEmpty()
    nombre: string;
}