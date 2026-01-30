import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { Empleado } from 'src/empleado/empleado.entity';
import { RolUsuario } from 'src/rol_usuario/rol_usuario.entity';
import { Rol } from 'src/rol/rol.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    @InjectRepository(Empleado) private empleadoRepo: Repository<Empleado>,
    @InjectRepository(RolUsuario) private rolUsuarioRepo: Repository<RolUsuario>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const adminEmail = 'admin@admin.com';
      
      const adminExists = await this.userRepo.findOne({ where: { email: adminEmail } } as any);
      if (adminExists) return;

      console.log('🚀 Iniciando Seed Completo...');

      // 1. Crear o buscar el Rol "admin"
      // Usamos 'as any' para evitar que TS piense que devuelve un array (Rol[])
      let rolAdmin: any = await this.rolRepo.findOne({ where: { rol: 'administrador' } } as any);
      
      if (!rolAdmin) {
        rolAdmin = await this.rolRepo.save(
          this.rolRepo.create({
            rol: 'administrador',
            descripcion: 'Administrador con acceso total al sistema'
          } as any)
        );
      }

      // 2. Crear Empleado (Corrigiendo el error de DeepPartial de la imagen)
      const empleadoGuardado = await this.empleadoRepo.save(
        this.empleadoRepo.create({
          nombre: 'Admin',
          apellido: 'Principal',
          segundoApellido: 'Sistema',
          cedula: '0106839814',
          telefono: '0981514649',
          direccion: 'Dirección General de Sistema',
          genero: 'MASCULINO',
          edad: 30,
          fechaNacimiento: new Date('1990-01-01'),
          cargo: 'ADMINISTRADOR'
        } as any)
      );

      // 3. Crear Usuario (Corrigiendo el error de propiedad 'empleado' de la imagen)
      const passwordHash = await bcrypt.hash('admin123', 10);
      const usuarioGuardado = await this.userRepo.save(
        this.userRepo.create({
          nombre: 'Administrador',
          email: adminEmail,
          password: passwordHash,
          activo: true,
          empleado: empleadoGuardado, 
        } as any)
      );

      // 4. Vincular Usuario con el Rol
      await this.rolUsuarioRepo.save(
        this.rolUsuarioRepo.create({
          rol: rolAdmin,
          usuario: usuarioGuardado
        } as any)
      );

      console.log('✅ Sistema inicializado: admin@admin.com creado.');
    } catch (error) {
      console.error('❌ Error en el Seed:', error.message);
    }
  }
}