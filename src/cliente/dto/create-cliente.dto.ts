import { IsString,IsEmail, MaxLength, IsNotEmpty} from "class-validator";
 
export class CreateClienteDto{
        @IsString()
        @MaxLength(100)
        @IsNotEmpty()
        nombre: string;
        @IsString()
        @MaxLength(10)
        @IsNotEmpty()
        cedula: string;
        @IsString()
        @MaxLength(15)
        @IsNotEmpty()
        telefono: string;
        @IsEmail()
        @MaxLength(150)
        @IsNotEmpty()
        email: string;
        @IsString()
        @IsNotEmpty()
        direccion:string;
}