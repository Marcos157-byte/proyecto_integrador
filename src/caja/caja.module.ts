import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { Caja } from './caja.entity';
import { Usuario } from 'src/usuario/usuario.entity'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [
    // Registramos las entidades que usa el servicio
    TypeOrmModule.forFeature([Caja, Usuario]) 
  ],
  controllers: [CajaController],
  providers: [CajaService],
  // Exportamos el servicio para que VentaService pueda usarlo
  exports: [CajaService] 
})
export class CajaModule {}