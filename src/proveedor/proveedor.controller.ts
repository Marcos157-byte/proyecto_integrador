import { 
  Controller, Get, Post, Put, Delete, Param, Body, Query 
} from '@nestjs/common';
import { ProveedorService } from './proveedor.service'; // ojo con la carpeta, debe ser "proveedor"
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Proveedor } from './proveedor.entity';

@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  // Crear proveedor
  @Post()
  async create(@Body() dto: Partial<Proveedor>): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.proveedorService.create(dto);
  }

  // Listar proveedores con paginación
  @Get()
  async findAll(@Query() query: QueryDto): Promise<Pagination<Proveedor>> {
    const { page, limit } = query;
    return this.proveedorService.findAll({ page, limit });
  }

  // Buscar proveedor por ID
  @Get(':id_proveedor')
  async findOne(@Param('id_proveedor') id_proveedor: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.proveedorService.findOne(id_proveedor);
  }

  // Actualizar proveedor
  @Put(':id_proveedor')
  async update(
    @Param('id_proveedor') id_proveedor: string,
    @Body() dto: Partial<Proveedor>,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.proveedorService.update(id_proveedor, dto);
  }

  // Eliminar proveedor
  @Delete(':id_proveedor')
  async remove(@Param('id_proveedor') id_proveedor: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.proveedorService.remove(id_proveedor);
  }
}