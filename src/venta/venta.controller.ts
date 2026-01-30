import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  Req, UseGuards
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('venta')
@UseGuards(JwtAuthGuard, RolesGuard) // Protegemos todo el controlador
export class VentaController {
  constructor(private readonly ventaService: VentaService) { }

  /**
   * 1. Dashboard: Resumen de ventas y estado de caja actual
   * Extrae el ID del usuario del token JWT automáticamente
   */
  @Get('dashboard/resumen')
  @Roles('ventas', 'admin')
  async getResumenVendedor(@Req() req) {
    const id_usuario = req.user.id_usuario;
    // Cambiamos la llamada para usar el método que SÍ existe en el service
    return await this.ventaService.getResumenVendedor(id_usuario);
  }

  /**
   * 2. Historial personal del cajero (Mis Ventas)
   * Ruta dedicada para que el cajero vea solo lo que él ha vendido
   */
  @Get('mis-ventas')
  @Roles('ventas', 'admin')
  async findMisVentas(@Query() query: QueryDto, @Req() req) {
    const id_usuario = req.user.id_usuario;
    return this.ventaService.findMisVentas(id_usuario, query);
  }

  /**
   * 3. Estadísticas globales: Productos más vendidos
   */
  @Get("stats/top-productos")
  @Roles('admin', 'ventas')
  async topProductos(@Query("periodo") periodo: string) {
    return this.ventaService.productosMasVendidos(periodo || 'dia');
  }

  /**
   * 4. Registrar nueva venta
   * El ID del usuario se inyecta desde el token para asegurar autoría
   */
  @Post()
  @Roles('ventas', 'admin')
  async create(@Body() createVentaDto: CreateVentaDto, @Req() req) {
    // Sobrescribimos el id_usuario del DTO con el del Token por seguridad
    createVentaDto.id_usuario = req.user.id_usuario;
    return this.ventaService.create(createVentaDto);
  }

  /**
   * 5. Historial General (Para administradores)
   */
  @Get()
  @Roles('admin')
  async findAll(@Query() query: QueryDto) {
    return this.ventaService.findAll(query);
  }

  /**
   * 6. Obtener una venta específica por ID
   */
  @Get(':id_venta')
  @Roles('ventas', 'admin')
  async findOne(@Param('id_venta') id_venta: string) {
    return this.ventaService.findOne(id_venta);
  }

  /**
   * 7. Actualizar venta (Uso restringido)
   */
  @Put(':id_venta')
  @Roles('admin')
  async update(
    @Param('id_venta') id_venta: string,
    @Body() updateVentaDto: UpdateVentaDto
  ) {
    return this.ventaService.update(id_venta, updateVentaDto);
  }

  /**
   * 8. Eliminar venta
   */
  @Delete(':id_venta')
  @Roles('admin')
  async remove(@Param('id_venta') id_venta: string) {
    return this.ventaService.remove(id_venta);
  }
}