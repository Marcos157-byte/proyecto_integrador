import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  // ======================================================
  // 1. RUTAS ESTÁTICAS (DASHBOARD) - DEBEN IR PRIMERO
  // ======================================================

  @Get('dashboard/stats')
  async getStats() {
    // Al estar arriba, NestJS no lo confunde con un :id_producto
    return this.productoService.getDashboardStats();
  }

  @Get('dashboard/stock-alerta')
  async getStockAlerta() {
    return this.productoService.getStockCriticoDetallado();
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