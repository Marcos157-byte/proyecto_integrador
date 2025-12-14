import { Module } from '@nestjs/common';
import { RolUsuarioService } from './rol_usuario.service';
import { RolUsuarioController } from './rol_usuario.controller';
import { RolUsuario } from './rol_usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RolUsuario])],
  providers: [RolUsuarioService],
  controllers: [RolUsuarioController]
})
export class RolUsuarioModule {}
