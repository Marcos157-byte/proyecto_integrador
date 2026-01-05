import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { Venta } from './venta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/cliente/cliente.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Producto } from 'src/producto/producto.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MovimientoInventario, MovimientoInventarioSchema } from 'src/movimiento_inventario/movimiento_inventario.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, Cliente, Usuario, Producto]),
    MongooseModule.forFeature([
      { name: MovimientoInventario.name, schema: MovimientoInventarioSchema },
    ]), // 👈 aquí registras el modelo de Mongo
  ],
  providers: [VentaService],
  controllers: [VentaController],
})
export class VentaModule {}