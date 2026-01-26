import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CategoriaService } from "./categoria.service";
import { CreateCategoriaDto } from "./dto/create-categoria.dto";
import { UpdateCategoriaDto } from "./dto/update-categoria.dto";
import { QueryDto } from "src/common/dto/query.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService:CategoriaService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bodega')
  @Post()
    async create(@Body() createCategoriaDto: CreateCategoriaDto) {
      return this.categoriaService.create(createCategoriaDto);

    }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bodega')
  @Get()
    async findAll(@Query() query: QueryDto) {
      return this.categoriaService.findAll(query);
    }

  @Get(':id_categoria')
  async findOne(@Param('id_categoria') id_categoria:string) {
    return this.categoriaService.findOne(id_categoria)
  }

  @Put(':id_categoria')
  async update(@Param('id_categoria') id_categoria:string, @Body() updateCategoriaDto:UpdateCategoriaDto) {
    return this.categoriaService.update(id_categoria, updateCategoriaDto);
  }

  @Delete(':id_categoria')
  async remove(@Param('id_categoria') id_categoria:string) {
    return this.categoriaService.remove(id_categoria);
  }
}