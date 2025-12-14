import { Module } from '@nestjs/common';
import { MovimientoInventarioService } from './movimiento_inventario.service';
import { MovimientoInventarioController } from './movimiento_inventario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MovimientoInventario, MovimientoInventarioSchema } from './movimiento_inventario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MovimientoInventario.name, schema: MovimientoInventarioSchema },
    ]),
  ],
  controllers: [MovimientoInventarioController],
  providers: [MovimientoInventarioService],
  exports: [MovimientoInventarioService], // opcional, si lo usas en otros módulos
})

export class MovimientoInventarioModule {}
