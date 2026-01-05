import { Controller, Get, Param } from '@nestjs/common';
import { VentaDetalleService } from './venta_detalle.service';

@Controller('venta-detalles')
export class VentaDetalleController {
  constructor(private readonly ventaDetalleService: VentaDetalleService) {}

  // GET /venta-detalles
  @Get()
  async findAll() {
    return await this.ventaDetalleService.findAll();
  }

  // GET /venta-detalles/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ventaDetalleService.findOne(id);
  }
}