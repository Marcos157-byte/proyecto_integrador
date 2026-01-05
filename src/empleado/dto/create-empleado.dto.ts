import { IsString,IsNumber,IsDate,IsBoolean, MaxLength, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateEmpleadoDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  nombre: string;
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  segundoNombre: string;
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  segundoApellido: string;

  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  cedula: string;   

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  telefono: string; 

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  genero: string;

  @Type(() => Number)
  @IsNumber()
  edad: number;

  @Type(() => Date)
  @IsDate()
  fechaNacimiento: Date;

  

}