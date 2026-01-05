// talla.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Talla, TallaSchema } from './talla.schema';
import { TallaService } from './talla.service';
import { TallaController } from './talla.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Talla.name, schema: TallaSchema }]),
  ],
  providers: [TallaService],
  controllers: [TallaController],
  exports: [
    MongooseModule, // 👈 exporta el MongooseModule para que otros módulos puedan usar TallaModel
  ],
})
export class TallaModule {}