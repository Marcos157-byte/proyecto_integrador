import { IsUUID, IsDate, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVentaDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaVenta: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsNotEmpty()
  metodoPago: string;

  @IsUUID()
  @IsNotEmpty()
  id_cliente: string;

  @IsUUID()
  @IsNotEmpty()
  id_usuario: string;
}