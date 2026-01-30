import { Controller, Post, Body, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';


@Controller('caja')
@UseGuards(JwtAuthGuard, RolesGuard) // Protegemos todas las rutas de caja
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Roles('ventas', 'admin') // Solo personal autorizado
  @Post('abrir')
  async abrirCaja(@Body() dto: CreateCajaDto, @Req() req) {
    const id_usuario = req.user.id_usuario;
    return this.cajaService.abrirCaja(id_usuario, dto.monto_apertura);
  }

  @Roles('ventas', 'admin')
  @Get('estado')
  async verEstado(@Req() req) {
    const id_usuario = req.user.id_usuario;
    return this.cajaService.getCajaActiva(id_usuario);
  }

  @Roles('ventas', 'admin')
  @Patch('cerrar')
  async cerrarCaja(@Body() dto: UpdateCajaDto, @Req() req) {
    const id_usuario = req.user.id_usuario;
    return this.cajaService.cerrarCaja(id_usuario, dto.monto_cierre);
  }
}