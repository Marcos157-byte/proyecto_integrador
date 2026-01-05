import { IsEmail, IsNotEmpty, IsString, MaxLength, } from "class-validator";

export class CreateProveedorDto{

        @IsString()
        @MaxLength(100)
        @IsNotEmpty()
        nombre: string;
        @IsString()
        @MaxLength(100)
        @IsNotEmpty()
        contacto: string;
        @IsString()
        @MaxLength(15)
        @IsNotEmpty()
        telefono: string;
        @IsEmail()
        @MaxLength(100)
        @IsNotEmpty()
        email: string;
        @IsString()
        @MaxLength(100)
        @IsNotEmpty()
        direccion: string; 
}