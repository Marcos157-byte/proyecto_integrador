import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  Req, UseGuards, UnauthorizedException
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('venta')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VentaController {
  constructor(private readonly ventaService: VentaService) { }

  /**
   * REPORTE POR RANGO (PARA ADMIN)
   * URL: GET /venta/reporte/rango?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
   */
  @Get('reporte/rango')
  @Roles('administrador')
  async getReportePorRango(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    const data = await this.ventaService.reportePorRango(desde, hasta);
    return {
      success: true,
      message: 'Reporte generado correctamente',
      data: data
    };
  }

  @Get('dashboard/resumen')
  @Roles('ventas', 'administrador')
  async getResumenVendedor(@Req() req) {
    const id_usuario = req.user.id; 
    if (!id_usuario) throw new UnauthorizedException('Usuario no identificado');
    return await this.ventaService.getResumenVendedor(id_usuario);
  }

  @Get('mis-ventas')
  @Roles('ventas', 'administrador')
  async findMisVentas(@Query() query: QueryDto, @Req() req) {
    const id_usuario = req.user.id;
    return this.ventaService.findMisVentas(id_usuario, query);
  }

  @Get('reporte/ranking')
  @Roles('administrador')
  getRanking() {
    return this.ventaService.rankingVendedores();
  }

  @Get('reporte/usuario/:id')
  @Roles('administrador')
  getVentasUsuario(@Param('id') id: string) {
    return this.ventaService.findVentasByUsuario(id);
  }

  @Get("stats/top-productos")
  @Roles('administrador', 'ventas')
  async topProductos(@Query("periodo") periodo: string) {
    return this.ventaService.productosMasVendidos(periodo || 'dia');
  }

  @Post()
  @Roles('ventas', 'administrador')
  async create(@Body() createVentaDto: CreateVentaDto, @Req() req) {
    createVentaDto.id_usuario = req.user.id; 
    return this.ventaService.create(createVentaDto);
  }

  @Get()
  @Roles('administrador')
  async findAll(@Query() query: QueryDto) {
    return this.ventaService.findAll(query);
  }

  @Get(':id_venta')
  @Roles('ventas', 'administrador')
  async findOne(@Param('id_venta') id_venta: string) {
    return this.ventaService.findOne(id_venta);
  }

  @Put(':id_venta')
  @Roles('administrador')
  async update(@Param('id_venta') id_venta: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventaService.update(id_venta, updateVentaDto);
  }

  @Delete(':id_venta')
  @Roles('administrador')
  async remove(@Param('id_venta') id_venta: string) {
    return this.ventaService.remove(id_venta);
  }
}