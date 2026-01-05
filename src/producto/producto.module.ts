import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { Producto } from './producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from 'src/color/color.entity';
import { Proveedor } from 'src/proveedor/proveedor.entity';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { TallaModule } from 'src/talla/talla.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto,Color,Proveedor]), CategoriaModule,TallaModule],
  
  controllers: [ProductoController],
  providers: [ProductoService]
})
export class ProductoModule {}
