import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { Empleado } from 'src/empleado/empleado.entity';
import { RolUsuario } from 'src/rol_usuario/rol_usuario.entity';
import { Rol } from 'src/rol/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Empleado, RolUsuario, Rol]) // <--- Agrega Rol aquí
  ],
  providers: [SeedService],
})
export class SeedModule {}