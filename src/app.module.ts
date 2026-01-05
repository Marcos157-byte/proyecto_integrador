import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CategoriaModule } from './categoria/categoria.module';
import { TallaModule } from './talla/talla.module';
import { ColorModule } from './color/color.module';
import { ClienteModule } from './cliente/cliente.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadoModule } from './empleado/empleado.module';
import { RolModule } from './rol/rol.module';
import { ProductoModule } from './producto/producto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RolUsuarioModule } from './rol_usuario/rol_usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MovimientoInventarioModule } from './movimiento_inventario/movimiento_inventario.module';
import { VentaModule } from './venta/venta.module';
import { VentaDetalleModule } from './venta_detalle/venta_detalle.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
 imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      //ssl: { rejectUnauthorized: false },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/inventario_jeans', {
      dbName: 'inventario_jeans', // opcional, si quieres especificar el nombre
    }),
    
    TallaModule,
    CategoriaModule,
    ColorModule,
    ClienteModule,
    EmpleadoModule,
    RolModule,
    ProductoModule,
    ProveedorModule,
    UsuarioModule,
    RolUsuarioModule,
    MovimientoInventarioModule,
    VentaModule,
    VentaDetalleModule,
    MailModule,
    AuthModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
