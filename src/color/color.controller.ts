import { 
  Controller, Get, Post, Put, Delete, Param, Body, Query 
} from '@nestjs/common';
import { ColorService } from './color.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Color } from './color.entity';

@Controller('colores')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  // Crear color
  @Post()
  async create(@Body() dto: Partial<Color>): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.colorService.create(dto);
  }

  // Listar colores con paginación
  @Get()
  async findAll(@Query() query: QueryDto): Promise<Pagination<Color>> {
    const { page, limit } = query;
    return this.colorService.findAll({ page, limit });
  }

  // Buscar color por ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.colorService.findOne(id);
  }

  // Actualizar color
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<Color>,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.colorService.update(id, dto);
  }

  // Eliminar color
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.colorService.remove(id);
  }
}