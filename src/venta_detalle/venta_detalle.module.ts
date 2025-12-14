import { Module } from '@nestjs/common';
import { VentaDetalleService } from './venta_detalle.service';
import { VentaDetalleController } from './venta_detalle.controller';
import { VentaDetalle } from './venta_detalle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VentaDetalle])],
  providers: [VentaDetalleService],
  controllers: [VentaDetalleController]
})
export class VentaDetalleModule {}
