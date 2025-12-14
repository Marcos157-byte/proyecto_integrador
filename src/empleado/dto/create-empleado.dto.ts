import { IsString,IsNumber,IsDate,IsBoolean } from "class-validator";
import { Type } from "class-transformer";

export class CreateEmpleadoDto {
@IsString()
  nombre: string;

  @IsString()
  segundoNombre: string;

  @IsString()
  apellido: string;

  @IsString()
  segundoApellido: string;

  @IsString()
  cedula: string;   // ✅ coincide con la entidad

  @IsString()
  direccion: string;

  @IsString()
  telefono: string; // ✅ coincide con la entidad

  @IsString()
  genero: string;

  @Type(() => Number)
  @IsNumber()
  edad: number;

  @Type(() => Date)
  @IsDate()
  fechaNacimineto: Date;

  @IsBoolean()
  estado: boolean;

}