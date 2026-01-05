import { IsString,IsOptional, IsEmail, MaxLength } from "class-validator";

export class UpdateProveedorDto{
        @IsOptional()
        @IsString()
        @MaxLength(100)
        nombre?: string;
        @IsOptional()
        @IsString()
        @MaxLength(100)
        contacto?: string;
        @IsOptional()
        @IsString()
        @MaxLength(15)
        telefono?: string;
        @IsOptional()
        @IsEmail()
        @MaxLength(100)
        email?: string;
        @IsOptional()
        @IsString()
        @MaxLength(100)
        direccion?: string; 
}