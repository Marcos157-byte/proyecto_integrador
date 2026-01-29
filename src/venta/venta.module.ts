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
import { CajaModule } from 'src/caja/caja.module'; // Importas el módulo

@Module({
  imports: [
    // 1. Entidades de Base de Datos SQL
    TypeOrmModule.forFeature([Venta, Cliente, Usuario, Producto]), 
    
    // 2. Esquemas de MongoDB
    MongooseModule.forFeature([
      { name: MovimientoInventario.name, schema: MovimientoInventarioSchema },
    ]),
    
    // 3. Otros Módulos (CajaModule va AQUÍ, fuera de forFeature)
    CajaModule, 
  ],
  providers: [VentaService],
  controllers: [VentaController],
})
export class VentaModule {}