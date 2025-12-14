import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateVentaDetalleDto {
  @IsOptional()
  @IsUUID()
  id_venta?: string;

  @IsOptional()
  @IsUUID()
  id_producto?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  cantidad?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  precio_unitario?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  iva?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  subtotal?: number;
}