import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UptateUsuarioDto } from './dto/update-usuario.dto';
import { QueryDto } from 'src/common/dto/query.dto';

// 👇 Importa los guards y el decorador de roles
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Solo "administrador" puede crear usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador','Ventas')
  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  // "administrador" y "usuario" pueden listar usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'Ventas')
  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.usuarioService.findAll(query);
  }

  // "usuario" puede ver su propio perfil
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('usuario')
  @Get(':id_usuario')
  async findOne(@Param('id_usuario') id_usuario: string) {
    return this.usuarioService.findOne(id_usuario);
  }

  // Solo "administrador" puede actualizar usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id_usuario')
  async update(
    @Param('id_usuario') id_usuario: string,
    @Body() updateUsuarioDto: UptateUsuarioDto,
  ) {
    return this.usuarioService.update(id_usuario, updateUsuarioDto);
  }

  // Solo "administrador" puede eliminar usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id_usuario')
  async remove(@Param('id_usuario') id_usuario: string) {
    return this.usuarioService.remove(id_usuario);
  }

  // Ejemplo extra: endpoint protegido solo para administradores
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get('admin-only')
  findAdminData() {
    return 'Solo administrador puede ver esto';
  }

  // Ejemplo extra: endpoint protegido solo para usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('usuario')
  @Get('user-only')
  findUserData() {
    return 'Solo usuarios con rol usuario pueden ver esto';
  }
}