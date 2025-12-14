import { IsString, IsBoolean, IsUUID } from "class-validator";

export class CreateUsuarioDto {
    
        @IsString()
        nombre: string;
        @IsString()
        email: string;
        @IsString()
        password: string;
        @IsBoolean()
        activo: boolean;
        @IsUUID()
        id_empleado: string;
        

}