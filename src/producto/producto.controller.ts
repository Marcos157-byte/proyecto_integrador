import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  // Crear producto
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('Bodega')
  @Post()
  async create(@Body() dto: CreateProductoDto) {
    return this.productoService.create(dto);
  }

  // Listar productos con paginación y filtros
  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.productoService.findAll(query);
  }

  // Buscar producto por ID
  @Get(':id_producto')
  async findOne(@Param('id_producto') id_producto: string) {
    return this.productoService.findOne(id_producto);
  }

  // Actualizar producto
  @Put(':id_producto')
  async update(@Param('id_producto') id_producto: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(id_producto, updateProductoDto);
  }

  // Eliminar producto
  @Delete(':id_producto')
  async remove(@Param('id_producto') id_producto: string) {
    return this.productoService.remove(id_producto);
  }
}