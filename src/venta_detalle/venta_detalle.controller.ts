import { 
  Controller, Get, Post, Put, Delete, Body, Param, 
  NotFoundException, InternalServerErrorException 
} from '@nestjs/common';
import { VentaDetalleService } from './venta_detalle.service';
import { CreateVentaDetalleDto } from './dto/create-venta_detalle.dto';
import { UpdateVentaDetalleDto } from './dto/update-venta_detalle.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { VentaDetalle } from './venta_detalle.entity';


@Controller('venta-detalle')
export class VentaDetalleController {
    constructor(private readonly ventaDetalleService: VentaDetalleService) {}

  // Crear detalle de venta
  @Post()
  async create(@Body() dto: CreateVentaDetalleDto) {
    const detalle = await this.ventaDetalleService.create(dto);
    if (!detalle) throw new InternalServerErrorException('No se pudo crear el detalle de venta');
    return new SuccessResponseDto('Detalle de venta creado correctamente', detalle);
  }

  // Listar todos los detalles
  @Get()
  async findAll() {
    const detalles = await this.ventaDetalleService.findAll();
    if (!detalles) throw new InternalServerErrorException('No se pudieron obtener los detalles');
    return new SuccessResponseDto('Detalles de venta obtenidos correctamente', detalles);
  }

  // Buscar detalle por ID
  @Get(':id_ventaDetalle')
  async findOne(@Param('id_ventaDetalle') id_ventaDetalle: string) {
    const detalle = await this.ventaDetalleService.findOne(id_ventaDetalle);
    if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');
    return new SuccessResponseDto('Detalle de venta encontrado correctamente', detalle);
  }

  // Actualizar detalle
  @Put(':id_ventaDetalle')
  async update(
    @Param('id_ventaDetalle') id_ventaDetalle: string,
    @Body() dto: UpdateVentaDetalleDto,
  ) {
    const detalle = await this.ventaDetalleService.update(id_ventaDetalle, dto);
    if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');
    return new SuccessResponseDto('Detalle de venta actualizado correctamente', detalle);
  }

  // Eliminar detalle
  @Delete(':id_ventaDetalle')
  async remove(@Param('id_ventaDetalle') id_ventaDetalle: string) {
    const detalle = await this.ventaDetalleService.remove(id_ventaDetalle);
    if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');
    return new SuccessResponseDto('Detalle de venta eliminado correctamente', detalle);
  }
}


