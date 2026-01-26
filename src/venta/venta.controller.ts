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
  async create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.ventaService.findAll(query);
  }

  // 👇 primero las rutas fijas
  @Get("reportes/productos")
  productosMasVendidos(@Query("periodo") periodo: string) {
    return this.ventaService.productosMasVendidos(periodo);
  }

  @Get('ventas')
  async ventasPorPeriodo(@Query('periodo') periodo: 'dia' | 'semana' | 'mes') {
    const data = await this.ventaService.ventasPorPeriodo(periodo);
    return {
      success: true,
      message: `Ventas agrupadas por ${periodo}`,
      data,
    };
  }

  @Get('ventas-todos')
  async ventasPorTodosPeriodos() {
    const dia = await this.ventaService.ventasPorPeriodo('dia');
    const semana = await this.ventaService.ventasPorPeriodo('semana');
    const mes = await this.ventaService.ventasPorPeriodo('mes');

    return {
      success: true,
      message: 'Ventas agrupadas por día, semana y mes',
      data: { dia, semana, mes },
    };
  }

  // 👇 después las rutas dinámicas
  @Get(':id_venta')
  async findOne(@Param('id_venta') id_venta: string) {
    return this.ventaService.findOne(id_venta);
  }

  @Put(':id_venta')
  async update(@Param('id_venta') id_venta: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventaService.update(id_venta, updateVentaDto);
  }

  @Delete(':id_venta')
  async remove(@Param('id_venta') id_venta: string) {
    return this.ventaService.remove(id_venta);
  }


  
}


