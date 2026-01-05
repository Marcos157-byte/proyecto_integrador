import { IsString, IsArray, IsUUID, MaxLength, IsNotEmpty, IsEmail } from "class-validator";

export class CreateUsuarioDto {
    
        @IsString()
        @MaxLength(100)
        @IsNotEmpty()
        nombre: string;
        @IsEmail()
        @MaxLength(100)
        @IsNotEmpty()
        email: string;
        @IsString()
        @MaxLength(255)
        @IsNotEmpty()
        password: string;
        @IsUUID()
        @IsNotEmpty()
        id_empleado: string;
        @IsArray()
        @IsUUID("all", { each: true })
        rolesIds: string[];
        

}