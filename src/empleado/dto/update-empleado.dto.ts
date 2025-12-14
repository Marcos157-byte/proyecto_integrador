import { IsString, IsNumber, IsDate, IsBoolean, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class UpdateEmpleadoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  segundoNombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  segundoApellido?: string;

  @IsOptional()
  @IsString()
  cedula?: string;   // ✅ coincide con la entidad

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string; // ✅ coincide con la entidad

  @IsOptional()
  @IsString()
  genero?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  edad?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaNacimineto?: Date;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}