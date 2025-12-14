import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, 
  NotFoundException, InternalServerErrorException 
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';


@Controller('empleado')
export class EmpleadoController {
    constructor(private readonly empleadoService: EmpleadoService) {}

  // Crear empleado
  @Post()
    async create(@Body() dto: CreateEmpleadoDto) {
    const empleado = await this.empleadoService.create(dto);

    if (!empleado) {
        throw new InternalServerErrorException('No se pudo crear el empleado');
    }

    return new SuccessResponseDto('Empleado creado correctamente', empleado);
    }
  // Listar empleados con paginación
  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Empleado>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.empleadoService.findAll(query);

    if (!result) throw new InternalServerErrorException('No se pudieron obtener los empleados');

    return new SuccessResponseDto<Pagination<Empleado>>('Empleados obtenidos correctamente', result);
  }

  // Buscar empleado por ID
  @Get(':id_empleado')
  async findOne(@Param('id_empleado') id_empleado: string) {
    const empleado = await this.empleadoService.findOne(id_empleado);
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return new SuccessResponseDto('Empleado encontrado correctamente', empleado);
  }

  // Actualizar empleado
  @Put(':id_empleado')
  async update(@Param('id_empleado') id_empleado: string, @Body() dto: UpdateEmpleadoDto) {
    const empleado = await this.empleadoService.update(id_empleado, dto);
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return new SuccessResponseDto('Empleado actualizado correctamente', empleado);
  }

  // Eliminar empleado
  @Delete(':id_empleado')
  async remove(@Param('id_empleado') id_empleado: string) {
    const empleado = await this.empleadoService.remove(id_empleado);
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return new SuccessResponseDto('Empleado eliminado correctamente', empleado);
  }

}
