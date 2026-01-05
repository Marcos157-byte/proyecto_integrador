import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRolDto {

    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    rol: string;
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    descripcion: string;
}