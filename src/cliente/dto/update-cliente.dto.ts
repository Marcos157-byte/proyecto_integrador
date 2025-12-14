import { IsString,IsOptional,IsEmail } from "class-validator";
 
export class UpdateClienteDto{
       

                @IsOptional()
                @IsString()
                nombre?: string;
                @IsOptional()
                @IsString()
                cedula?: string;
                @IsOptional()
                @IsString()
                telefono?: string;
                @IsOptional()
                @IsEmail()
                email?: string;
                @IsOptional()
                @IsString()
                direccion?:string;
               

}