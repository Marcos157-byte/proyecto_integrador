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
import { RolUsuarioService } from './rol_usuario.service';
import { CreateRolUsuarioDto } from './dto/create-rol_usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol_usuario.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RolUsuario } from './rol_usuario.entity';


@Controller('rol-usuario')
export class RolUsuarioController {
    constructor(private readonly rolUsuarioService: RolUsuarioService) {}

  // Crear relación rol-usuario
  @Post()
  async create(@Body() dto: CreateRolUsuarioDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.rolUsuarioService.create(dto);
  }

  // Listar relaciones con paginación
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<RolUsuario>> {
    return this.rolUsuarioService.findAll({ page, limit });
  }

  // Buscar relación por ID
  @Get(':id_rolUsuario')
  async findOne(@Param('id_rolUsuario') id_rolUsuario: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.rolUsuarioService.findOne(id_rolUsuario);
  }

  // Actualizar relación rol-usuario
  @Put(':id_rolUsuario')
  async update(
    @Param('id_rolUsuario') id_rolUsuaio: string,
    @Body() dto: UpdateRolUsuarioDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.rolUsuarioService.update(id_rolUsuaio, dto);
  }

  // Eliminar relación rol-usuario
  @Delete(':id_rolUsuario')
  async remove(@Param('id_rolUsuario') id_rolUsuario: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    return this.rolUsuarioService.remove(id_rolUsuario);
  }
}


