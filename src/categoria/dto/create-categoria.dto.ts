import {  IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoriaDto {
    
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    nombre: string;
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}