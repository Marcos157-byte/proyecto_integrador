import { Module } from '@nestjs/common';
import { RolUsuarioService } from './rol_usuario.service';
import { RolUsuarioController } from './rol_usuario.controller';
import { RolUsuario } from './rol_usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from 'src/rol/rol.entity';
import { Usuario } from 'src/usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolUsuario,Rol,Usuario])],
  providers: [RolUsuarioService],
  controllers: [RolUsuarioController],
  exports: [RolUsuarioService, TypeOrmModule]
})
export class RolUsuarioModule {}
