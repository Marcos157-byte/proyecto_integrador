import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class UpdateEmpleadoDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  segundoNombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  segundoApellido?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  cedula?: string;   

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefono?: string; 

  @IsOptional()
  @IsString()
  @MaxLength(20)
  genero?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  edad?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaNacimiento?: Date;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}