import { IsBoolean, IsOptional, IsString, } from "class-validator";

export class UptateUsuarioDto{
        @IsOptional()
        @IsString()
        nombre?: string;
        @IsOptional()
        @IsString()
        email?: string;
        @IsOptional()
        @IsString()
        password?: string;
        @IsOptional()
        @IsBoolean()
        activo?: boolean;
        @IsOptional()
        @IsString()
        id_empleado: string;

        
}