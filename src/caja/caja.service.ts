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

  // 1. APERTURA: Iniciar el turno del cajero
  async abrirCaja(id_usuario: string, monto_apertura: number) {
    // Validar si ya existe una caja abierta para este usuario
    const cajaActiva = await this.cajaRepository.findOne({
      where: { usuario: { id_usuario }, estado: 'abierta' },
    });

    if (cajaActiva) {
      throw new BadRequestException('Ya tienes una sesión de caja activa. Debes cerrarla primero.');
    }

    const nuevaCaja = this.cajaRepository.create({
      usuario: { id_usuario },
      monto_apertura: Number(monto_apertura),
      estado: 'abierta',
      fecha_apertura: new Date(),
    });

    const guardado = await this.cajaRepository.save(nuevaCaja);
    return new SuccessResponseDto('Caja abierta correctamente', guardado);
  }

  // 2. ESTADO ACTUAL: Consultar ventas acumuladas del turno
  async getCajaActiva(id_usuario: string) {
    const caja = await this.cajaRepository.findOne({
      where: { usuario: { id_usuario }, estado: 'abierta' },
      relations: ['ventas'], 
    });

    if (!caja) return null;

    // Calculamos solo ventas en EFECTIVO para el arqueo físico
    const ventasEfectivo = caja.ventas
      .filter(v => v.metodoPago.toLowerCase() === 'efectivo')
      .reduce((sum, v) => sum + Number(v.total), 0);

    return {
      id_caja: caja.id_caja,
      fecha_apertura: caja.fecha_apertura,
      monto_apertura: Number(caja.monto_apertura),
      ventas_efectivo: ventasEfectivo,
      monto_esperado: Number(caja.monto_apertura) + ventasEfectivo,
      total_transacciones: caja.ventas.length
    };
  }

  // 3. CIERRE: Finalizar turno y calcular diferencia (Arqueo)
  async cerrarCaja(id_usuario: string, monto_cierre: number) {
    const caja = await this.cajaRepository.findOne({
      where: { usuario: { id_usuario }, estado: 'abierta' },
      relations: ['ventas'],
    });

    if (!caja) {
      throw new NotFoundException('No tienes ninguna caja abierta para cerrar.');
    }

    const ventasEfectivo = caja.ventas
      .filter(v => v.metodoPago.toLowerCase() === 'efectivo')
      .reduce((sum, v) => sum + Number(v.total), 0);

    const monto_esperado = Number(caja.monto_apertura) + ventasEfectivo;
    const diferencia = Number(monto_cierre) - monto_esperado;

    // Actualizamos la entidad
    caja.monto_cierre = Number(monto_cierre);
    caja.fecha_cierre = new Date();
    caja.estado = 'cerrada';

    await this.cajaRepository.save(caja);

    return new SuccessResponseDto('Caja cerrada y arqueo finalizado', {
      resumen: {
        inicio: caja.monto_apertura,
        ventas_efectivo: ventasEfectivo,
        total_esperado: monto_esperado,
        contado_fisico: monto_cierre,
        diferencia: diferencia, // Negativo = Faltante, Positivo = Sobrante
        resultado: diferencia === 0 ? 'Caja Cuadrada' : diferencia < 0 ? 'Faltante' : 'Sobrante'
      }
    });
  }
}