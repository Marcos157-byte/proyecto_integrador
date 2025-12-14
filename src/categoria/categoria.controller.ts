import { Controller, Get, Post, Put, Delete, Body, Param, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CategoriaService } from './categoria.service';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async create(@Body() dto: CreateCategoriaDto) {
    const categoria = await this.categoriaService.create(dto);
    return new SuccessResponseDto('Categoría creada con éxito', categoria);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Categoria>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.categoriaService.findAll(query);

    if (!result) throw new InternalServerErrorException('No se pudieron obtener las categorías');

    return new SuccessResponseDto('Categorías obtenidas con éxito', result);
  }

  @Get(':id_categoria')
  async findOne(@Param('id_categoria') id_categoria: string) {
    const categoria = await this.categoriaService.findOne(id_categoria);
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return new SuccessResponseDto('Categoría obtenida con éxito', categoria);
  }

  @Put(':id_categoria')
  async update(@Param('id_categoria') id_categoria: string, @Body() dto: UpdateCategoriaDto) {
    const categoria = await this.categoriaService.update(id_categoria, dto);
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return new SuccessResponseDto('Categoría actualizada con éxito', categoria);
  }

  @Delete(':id_categoria')
  async remove(@Param('id_categoria') id_categoria: string) {
    const categoria = await this.categoriaService.remove(id_categoria);
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return new SuccessResponseDto('Categoría eliminada con éxito', categoria);
  }
}