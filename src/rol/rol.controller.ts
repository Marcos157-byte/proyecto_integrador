import { Controller, Get, Post, Put, Delete, Body, Param, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RolService } from './rol.service';
import { Rol } from './rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  async create(@Body() dto: CreateRolDto) {
    const rol = await this.rolService.create(dto);
    return new SuccessResponseDto('Rol creado con éxito', rol);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Rol>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.rolService.findAll(query);

    if (!result) throw new InternalServerErrorException('No se pudieron obtener los roles');

    return new SuccessResponseDto('Roles obtenidos con éxito', result);
  }

  @Get(':id_rol')
  async findOne(@Param('id_rol') id_rol: string) {
    const rol = await this.rolService.findOne(id_rol);
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return new SuccessResponseDto('Rol obtenido con éxito', rol);
  }

  @Put(':id_rol')
  async update(@Param('id_rol') id_rol: string, @Body() dto: UpdateRolDto) {
    const rol = await this.rolService.update(id_rol, dto);
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return new SuccessResponseDto('Rol actualizado con éxito', rol);
  }

  @Delete(':id_rol')
  async remove(@Param('id_rol') id_rol: string) {
    const rol = await this.rolService.remove(id_rol);
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return new SuccessResponseDto('Rol eliminado con éxito', rol);
  }
}