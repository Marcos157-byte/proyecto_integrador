import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query 
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { QueryDto } from 'src/common/dto/query.dto';



@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  async create(@Body()createVentaDto:CreateVentaDto){
    return this.ventaService.create(createVentaDto);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.ventaService.findAll(query);
  }
  @Get(':id_venta')
  async findOne(@Param('id_venta') id_venta:string){
    return this.ventaService.findOne(id_venta);
  }
  @Put(':id_venta')
  async update(@Param('id_venta') id_venta:string,@Body() updateVentaDto: UpdateVentaDto){
    return this.ventaService.update(id_venta,updateVentaDto);
  }
  @Delete(':id_venta')
  async remove(@Param('id_venta') id_venta:string){
    return this.ventaService.remove(id_venta);
  }    
  
}


