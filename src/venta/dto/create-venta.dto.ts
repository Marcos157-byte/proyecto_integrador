import { IsUUID, IsDate, IsNumber, IsString, IsNotEmpty, MaxLength,IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateVentaDetalleDto } from 'src/venta_detalle/dto/create-venta_detalle.dto';
export class CreateVentaDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  metodoPago: string;

  @IsOptional()
  subtotal?: number;

  @IsOptional()
  iva?: number;

  @IsOptional()
  total?: number;




  @IsUUID()
  @IsNotEmpty()
  id_cliente: string;

  @IsUUID()
  @IsNotEmpty()
  id_usuario: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  ventasDetalles: CreateVentaDetalleDto[];
}
