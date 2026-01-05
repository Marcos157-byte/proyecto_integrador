import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MaxLength, } from "class-validator";

export class UptateUsuarioDto{
        @IsOptional()
        @IsString()
        @MaxLength(100)
        nombre?: string;
        @IsOptional()
        @IsEmail()
        @MaxLength(100)
        email?: string;
        @IsOptional()
        @IsString()
        @MaxLength(255)
        password?: string;
        @IsOptional()
        @IsBoolean()
        activo?: boolean;
        @IsOptional()
        @IsString()
        @IsUUID()
        id_empleado: string;

        
}