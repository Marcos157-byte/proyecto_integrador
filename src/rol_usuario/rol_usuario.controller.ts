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
import { QueryDto } from 'src/common/dto/query.dto';


@Controller('rol-usuario')
export class RolUsuarioController {
    constructor(private readonly rolUsuarioService: RolUsuarioService) {}

    @Post()
    async create(@Body() createRolUsuarioDto:CreateRolUsuarioDto) {
      return this.rolUsuarioService.create(createRolUsuarioDto);

    }

    @Get()
    async findAll(@Query() query: QueryDto) {
      return this.rolUsuarioService.findAll(query);
    }

    @Get('id_rolUsuario')
    async findOne(@Param('id_rolUsuario') id_rolUsuario: string){
      return this.rolUsuarioService.findOne(id_rolUsuario);
    }

    @Put(':id_rolUsuario')
    async update(@Param('id:rolUsuario') id_rolUsuario:string, @Body() updateRolUsuarioDto:UpdateRolUsuarioDto){
      return this.rolUsuarioService.update(id_rolUsuario, updateRolUsuarioDto);
    }

    @Delete(':id_rolUsuario')
    async remove(@Param('id_rolUsuario') id_rolUsuario: string){
      return this.rolUsuarioService.remove(id_rolUsuario);
    }



  
}


