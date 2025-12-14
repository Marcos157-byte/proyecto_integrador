import { IsUUID, IsDate, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateVentaDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaVenta?: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  total?: number;

  @IsOptional()
  @IsString()
  metodoPago?: string;

  @IsOptional()
  @IsUUID()
  id_cliente?: string;

  @IsOptional()
  @IsUUID()
  id_usuario?: string;
}