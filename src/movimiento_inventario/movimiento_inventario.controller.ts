import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { MovimientoInventarioService } from './movimiento_inventario.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento_inventario.dto';
import { UpdateMovimientoInventarioDto } from './dto/update-movimiento_inventario.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Controller('movimiento-inventario')
export class MovimientoInventarioController {
  constructor(private readonly movimientoService: MovimientoInventarioService) {}

  // Crear movimiento
  @Post()
  async create(
    @Body() dto: CreateMovimientoInventarioDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.movimientoService.create(dto);
  }

  // Listar movimientos con paginación
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.movimientoService.findAll(page, limit);
  }

  // Buscar movimiento por ID
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.movimientoService.findOne(id);
  }

  // Actualizar movimiento
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMovimientoInventarioDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.movimientoService.update(id, dto);
  }

  // Eliminar movimiento
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.movimientoService.remove(id);
  }
}