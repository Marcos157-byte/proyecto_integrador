// categoria.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Categoria, CategoriaSchema } from './categoria.schema';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Categoria.name, schema: CategoriaSchema }]),
  ],
  providers: [CategoriaService],
  controllers: [CategoriaController],
  exports: [
    MongooseModule, // 👈 exporta el MongooseModule para que otros módulos puedan usar CategoriaModel
  ],
})
export class CategoriaModule {}