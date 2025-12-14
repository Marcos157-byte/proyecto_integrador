import { IsString,IsOptional, IsEmail } from "class-validator";

export class UpdateProveedorDto{
        @IsOptional()
        @IsString()
        nombre?: string;
        @IsOptional()
        @IsString()
        contacto?: string;
        @IsOptional()
        @IsString()
        telefono?: string;
        @IsOptional()
        @IsEmail()
        email?: string;
        @IsOptional()
        @IsString()
        direccion?: string; 
}