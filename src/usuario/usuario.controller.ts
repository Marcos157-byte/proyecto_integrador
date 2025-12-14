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
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Usuario } from './usuario.entity';
@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

  // Crear usuario
  @Post()
  async create(@Body() dto: CreateUsuarioDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.usuarioService.create(dto);
  }

  // Listar usuarios con paginación
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Usuario>> {
    return this.usuarioService.findAll({ page, limit });
  }

  // Buscar usuario por ID
  @Get(':id_usuario')
  async findOne(@Param('id_usuario') id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.usuarioService.findOne(id);
  }

  // Actualizar usuario
  @Put(':id_usuario')
  async update(
    @Param('id_usuario') id_usuario: string,
    @Body() dto: UptateUsuarioDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.usuarioService.update(id_usuario, dto);
  }

  // Eliminar usuario
  @Delete(':id_usuario')
  async remove(@Param('id_usuario') id_usuario: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.usuarioService.remove(id_usuario);
  }
}


