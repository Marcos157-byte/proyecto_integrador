import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate ,IsUUID} from "class-validator";

export class CreateMovimientoInventarioDto {
    @IsUUID()
    @IsNotEmpty()
    id_producto: string;

    @IsUUID()
    @IsNotEmpty()
    id_usuario: string;

  @IsString()
  @IsNotEmpty()
  tipoMovimiento: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaMovimiento?: Date;

  @IsString()
  @IsNotEmpty()
  observaciones: string;

  @IsString()
  @IsNotEmpty()
  motivo: string;
}