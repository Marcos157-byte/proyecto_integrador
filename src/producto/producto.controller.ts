import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  // ======================================================
  // 1. RUTAS ESTÁTICAS (DASHBOARD) - DEBEN IR PRIMERO
  // ======================================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bodega', 'administrador')
  @Get('dashboard/stats')
  async getStats() {
    const stats = await this.productoService.getDashboardStats();
    // Envolvemos para que el frontend reciba el objeto dentro de "data"
    return new SuccessResponseDto('Estadísticas cargadas', stats);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bodega', 'administrador')
  @Get('dashboard/stock-alerta')
  async getStockAlerta() {
    const alertas = await this.productoService.getStockAlerts(); // Usa el nombre unificado de tu service
    return new SuccessResponseDto('Alertas de stock obtenidas', alertas);
  }

  // ======================================================
  // 2. RUTAS DINÁMICAS (CRUD)
  // ======================================================

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.productoService.findAll(query);
  }

  @Get(':id_producto')
  async findOne(@Param('id_producto') id_producto: string) {
    // Si 'dashboard/stats' estuviera abajo, NestJS pensaría que "dashboard" es el ID
    return this.productoService.findOne(id_producto);
  }

  @Post()
  async create(@Body() dto: CreateProductoDto) {
    return this.productoService.create(dto);
  }

  @Put(':id_producto')
  async update(
    @Param('id_producto') id_producto: string, 
    @Body() updateProductoDto: UpdateProductoDto
  ) {
    return this.productoService.update(id_producto, updateProductoDto);
  }

  @Delete(':id_producto')
  async remove(@Param('id_producto') id_producto: string) {
    return this.productoService.remove(id_producto);
  }
}