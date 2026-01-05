import { IsString,IsOptional,IsEmail, MaxLength, IsBoolean } from "class-validator";
 
export class UpdateClienteDto{
       

    @IsOptional()
    @IsString()
    @MaxLength(100)
    nombre?: string;
    @IsOptional()
    @IsString()
    @MaxLength(10)
    cedula?: string;
    @IsOptional()
    @IsString()
    @MaxLength(15)
    telefono?: string;
    @IsOptional()
    @IsEmail()
    @MaxLength(150)
    email?: string;
    @IsOptional()
    @IsString()
    direccion?: string;
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
               

}