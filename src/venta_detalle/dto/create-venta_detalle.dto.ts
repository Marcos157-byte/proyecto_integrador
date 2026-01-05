import { IsUUID, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVentaDetalleDto {


  @IsUUID()
  @IsNotEmpty()
  id_producto: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  cantidad: number;

  
  
}