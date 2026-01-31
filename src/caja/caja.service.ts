import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caja } from './caja.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private cajaRepository: Repository<Caja>,
  ) {}

  // 1. OBTENER ESTADO ACTUAL
  async getCajaActiva(id_usuario: string) {
    const caja = await this.cajaRepository.findOne({
      where: { usuario: { id_usuario }, estado: 'abierta' },
      relations: ['ventas'],
    });

    if (!caja) return null;

    const ventasEfectivo = caja.ventas
      .filter(v => v.metodoPago.toLowerCase() === 'efectivo')
      .reduce((sum, v) => sum + Number(v.total), 0);

    return {
      id_caja: caja.id_caja,
      fecha_apertura: caja.fecha_apertura,
      monto_apertura: Number(caja.monto_apertura),
      ventas_efectivo: ventasEfectivo,
      monto_esperado: Number(caja.monto_apertura) + ventasEfectivo,
      total_transacciones: caja.ventas.length,
    };
  }

  // 2. ABRIR CAJA (Con validación de duplicados)
  async abrirCaja(id_usuario: string, monto_apertura: number) {
    // IMPORTANTE: Validar si ya hay una caja abierta antes de crear otra
    const cajaActiva = await this.cajaRepository.findOne({
      where: { usuario: { id_usuario }, estado: 'abierta' },
    });

    if (cajaActiva) {
      throw new BadRequestException('Ya tienes una sesión de caja activa.');
    }

    const nuevaCaja = this.cajaRepository.create({
      usuario: { id_usuario } as any,
      monto_apertura: Number(monto_apertura),
      estado: 'abierta',
      fecha_apertura: new Date(),
    });

    const guardado = await this.cajaRepository.save(nuevaCaja);
    return new SuccessResponseDto('Caja abierta exitosamente', guardado);
  }

  // 3. CERRAR CAJA
  async cerrarCaja(id_usuario: string, monto_cierre: number) {
    const caja = await this.cajaRepository.findOne({
      where: { usuario: { id_usuario }, estado: 'abierta' },
      relations: ['ventas'],
    });

    if (!caja) throw new NotFoundException('No hay ninguna caja abierta para cerrar.');

    const ventasEfectivo = caja.ventas
      .filter(v => v.metodoPago.toLowerCase() === 'efectivo')
      .reduce((sum, v) => sum + Number(v.total), 0);

    const monto_esperado = Number(caja.monto_apertura) + ventasEfectivo;
    
    caja.monto_cierre = Number(monto_cierre);
    caja.fecha_cierre = new Date();
    caja.estado = 'cerrada';

    await this.cajaRepository.save(caja);

    return new SuccessResponseDto('Caja cerrada correctamente', {
      resumen: {
        total_esperado: monto_esperado,
        contado_fisico: Number(monto_cierre),
        diferencia: Number(monto_cierre) - monto_esperado,
        resultado: (Number(monto_cierre) - monto_esperado) === 0 ? 'Caja Cuadrada' : 'Diferencia detectada'
      }
    });
  }
}