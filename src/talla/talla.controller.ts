import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { TallaService } from './talla.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Talla } from './talla.schema';

@Controller('tallas')
export class TallaController {
  constructor(private readonly tallaService: TallaService) {}

  // Crear talla
  @Post()
  async create(@Body() dto: Partial<Talla>): Promise<SuccessResponseDto> {
    return this.tallaService.create(dto);
  }

  // Listar tallas con paginación
  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto> {
    return this.tallaService.findAll(query);
  }

  // Buscar talla por ID
  @Get(':id_talla')
  async findOne(@Param('id_talla') id_talla: string): Promise<SuccessResponseDto> {
    return this.tallaService.findOne(id_talla);
  }

  // Actualizar talla
  @Put(':id_talla')
  async update(
    @Param('id_talla') id_talla: string,
    @Body() dto: Partial<Talla>,
  ): Promise<SuccessResponseDto> {
    return this.tallaService.update(id_talla, dto);
  }

  // Eliminar talla
  @Delete(':id_talla')
  async remove(@Param('id_talla') id_talla: string): Promise<SuccessResponseDto> {
    return this.tallaService.remove(id_talla);
  }
}