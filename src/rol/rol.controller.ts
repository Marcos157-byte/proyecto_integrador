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
  async create(@Body() createRolDto:CreateRolDto) {
    return this.rolService.create(createRolDto);
  }
  @Get()
  async findAll(@Query() query:QueryDto) {
    return this.rolService.findAll(query);
  }
  @Get(':id_rol') 
  async findOne(@Param('id_rol') id_rol: string) {
    return this.rolService.findOne(id_rol);
  }
  @Put(':id_rol') 
  async update(@Param('id_rol') id_rol:string, @Body() updateRolDto:UpdateRolDto) {
    return this.rolService.update(id_rol,updateRolDto);

  }
  @Delete(':id_rol')
  async remove(@Param('id_rol') id_rol:string) {
    return this.rolService.remove(id_rol);
  }
}