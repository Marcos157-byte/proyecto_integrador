import { IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVentaDetalleDto {
  @IsUUID()
  id_venta: string;

  @IsUUID()
  id_producto: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  cantidad: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  precio_unitario: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  iva: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  subtotal: number;
}