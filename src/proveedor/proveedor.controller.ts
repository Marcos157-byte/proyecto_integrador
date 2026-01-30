import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ProveedorService } from "./proveedor.service";
import { CreateProveedorDto } from "./dto/create-proveedor.dto";
import { UpdateProveedorDto } from "./dto/update-proveedor.dto";
import { QueryDto } from "src/common/dto/query.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/decorators/roles.decorator";
@Controller('proveedores')

export class ProveedorController{
  constructor(private readonly proveedorService:ProveedorService){}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bodega')
  @Post()
  async create(@Body() createProveedorDto:CreateProveedorDto){
    return this.proveedorService.create(createProveedorDto);
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('bodega','admintrador')
  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.proveedorService.findAll(query);
  }

  @Get(':id_proveedor') 
  async findOne(@Param('id_proveedor') id_proveedor: string) {
    return this.proveedorService.findOne(id_proveedor);
  }

  @Put(':id_proveedor')
  async update(@Param('id_proveedor') id_proveedor: string, @Body() updateProveedorDto:UpdateProveedorDto) {
    return this.proveedorService.update(id_proveedor,updateProveedorDto);

  }

  @Delete(':id_proveedor')
  async remove(@Param('id_proveedor') id_proveedor:string) {
    return this.proveedorService.remove(id_proveedor);
  }


}