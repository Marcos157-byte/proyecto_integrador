import { 
  Controller, Get, Post, Put, Delete, Param, Body, Query 
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Producto } from './producto.entity';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  // Crear producto
  @Post()
  async create(@Body() dto: CreateProductoDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.productoService.create(dto);
  }

  // Listar productos con paginación
  @Get()
  async findAll(@Query() query: QueryDto): Promise<Pagination<Producto>> {
    const { page, limit } = query;
    return this.productoService.findAll({ page, limit });
  }

  // Buscar producto por ID
  @Get(':id_producto')
  async findOne(@Param('id_producto') id_producto: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.productoService.findOne(id_producto);
  }

  // Actualizar producto
  @Put(':id_producto')
  async update(
    @Param('id_producto') id_producto: string,
    @Body() dto: UpdateProductoDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.productoService.update(id_producto, dto);
  }

  // Eliminar producto
  @Delete(':id_producto')
  async remove(@Param('id_producto') id_producto: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.productoService.remove(id_producto);
  }
}