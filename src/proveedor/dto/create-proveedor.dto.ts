import { IsEmail, IsString, } from "class-validator";

export class CreateProevedorDto{

        @IsString()
        nombre: string;
        @IsString()
        contacto: string;
        @IsString()
        telefono: string;
        @IsEmail()
        email: string;
        @IsString()
        direccion: string; 
}