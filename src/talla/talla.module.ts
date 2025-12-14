import { Module } from '@nestjs/common';
import { TallaController } from './talla.controller';
import { TallaService } from './talla.service';
import { Talla } from './talla.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Talla])],
  controllers: [TallaController],
  providers: [TallaService]
})
export class TallaModule {}
