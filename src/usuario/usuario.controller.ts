import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query 
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UptateUsuarioDto } from './dto/update-usuario.dto';

import { QueryDto } from 'src/common/dto/query.dto';
@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto){
    return this.usuarioService.create(createUsuarioDto);

  }

  @Get()
  async findAll(@Query() query:QueryDto){
    return this.usuarioService.findAll(query);
  }

  @Get(':id_usuario')
  async findOne(@Param('id_usuario') id_usuario:string){
    return this.usuarioService.findOne(id_usuario);
  }
  @Put(':id_usuario')
  async update(@Param('id_usuario') id_usuario:string,@Body() updateUsuarioDto:UptateUsuarioDto){
    return this.usuarioService.update(id_usuario,updateUsuarioDto);
  }
  @Delete(':id_usuario')
  async remove(@Param('id_usuario') id_usuario: string){
    return this.usuarioService.remove(id_usuario);
  }
}


