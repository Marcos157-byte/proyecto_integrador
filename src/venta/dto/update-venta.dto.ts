import { IsUUID, IsString, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVentaDetalleDto } from 'src/venta_detalle/dto/create-venta_detalle.dto';

export class UpdateVentaDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  metodoPago?: string;

  @IsOptional()
  @IsUUID()
  id_cliente?: string;

  @IsOptional()
  @IsUUID()
  id_usuario?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  ventasDetalles?: CreateVentaDetalleDto[];
}