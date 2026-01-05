import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentaDetalle } from './venta_detalle.entity';

@Injectable()
export class VentaDetalleService {
  constructor(
    @InjectRepository(VentaDetalle)
    private readonly detalleRepository: Repository<VentaDetalle>,
  ) {}

  async findAll() {
    return await this.detalleRepository.find({ relations: ['venta', 'producto'] });
  }

  async findOne(id_ventaDetalle: string) {
    const detalle = await this.detalleRepository.findOne({
      where: { id_ventaDetalle },
      relations: ['venta', 'producto'],
    });
    if (!detalle) throw new NotFoundException('Detalle no encontrado');
    return detalle;
  }
}