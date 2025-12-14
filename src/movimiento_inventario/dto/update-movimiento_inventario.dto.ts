import { Type } from "class-transformer";
import { IsString, IsUUID, IsNotEmpty,IsNumber, IsOptional, IsDate } from "class-validator";


export class UpdateMovimientoInventarioDto {
  @IsOptional()
  @IsUUID()
  id_producto?: string;

  @IsOptional()
  @IsUUID()
  id_usuario?: string;

  @IsOptional()
  @IsString()
  tipoMovimiento?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cantidad?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaMovimiento?: Date;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  motivo?: string;
}