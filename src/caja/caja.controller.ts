import { Controller, Post, Body, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('caja')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Roles('ventas', 'admin')
  @Get('estado-actual')
  async verEstado(@Req() req) {
    // Según tu JwtStrategy, el ID ahora se llama 'id'
    const userId = req.user.id; 
    
    if (!userId) throw new UnauthorizedException('Token inválido');

    const data = await this.cajaService.getCajaActiva(userId);
    return new SuccessResponseDto('Estado de caja obtenido', data);
  }

  @Roles('ventas', 'admin')
  @Post('abrir')
  async abrirCaja(@Body() dto: CreateCajaDto, @Req() req) {
    const userId = req.user.id;

    if (!userId) throw new UnauthorizedException('Token inválido');

    // Enviamos el userId correcto al servicio
    return this.cajaService.abrirCaja(userId, dto.monto_apertura);
  }

  @Roles('ventas', 'admin')
  @Post('cerrar') 
  async cerrarCaja(@Body() dto: { monto_cierre: number }, @Req() req) {
    const userId = req.user.id;

    if (!userId) throw new UnauthorizedException('Token inválido');

    return this.cajaService.cerrarCaja(userId, dto.monto_cierre);
  }
}