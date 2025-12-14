import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, 
  NotFoundException, InternalServerErrorException 
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { VentaService } from './venta.service';
import { Venta } from './venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';


@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
    async create(@Body() dto: CreateVentaDto) {
    return this.ventaService.create(dto); // 👈 ya no lo envuelves otra vez
    }

 @Get()
async findAll(@Query() query: QueryDto) {
  if (query.limit && query.limit > 100) {
    query.limit = 100;
  }

  const result = await this.ventaService.findAll(query);

  if (!result) throw new InternalServerErrorException('No se pudieron obtener las ventas');

  return new SuccessResponseDto('Ventas obtenidas correctamente', result);
}
  @Get(':id_venta')
  async findOne(@Param('id_venta') id_venta: string) {
    const venta = await this.ventaService.findOne(id_venta);
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return new SuccessResponseDto('Venta encontrada correctamente', venta);
  }

  @Put(':id_venta')
  async update(@Param('id_venta') id_venta: string, @Body() dto: UpdateVentaDto) {
    const venta = await this.ventaService.update(id_venta, dto);
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return new SuccessResponseDto('Venta actualizada correctamente', venta);
  }

  @Delete(':id_venta')
  async remove(@Param('id_venta') id_venta: string) {
    const venta = await this.ventaService.remove(id_venta);
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return new SuccessResponseDto('Venta eliminada correctamente', venta);
  }
}


