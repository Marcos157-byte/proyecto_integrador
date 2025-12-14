import { IsString,IsEmail} from "class-validator";
 
export class CreateClienteDto{
        @IsString()
        nombre: string;
        @IsString()
        cedula: string;
        @IsString()
        telefono: string;
        @IsEmail()
        email: string;
        @IsString()
        direccion:string;
}