import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Categoria } from './categoria.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // Crear categoría
  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria | null> {
    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto);
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      console.error('Error al crear la categoría', error);
      return null;
    }
  }

  // Listar categorías con paginación
  async findAll(options: IPaginationOptions): Promise<Pagination<Categoria>> {
    const queryBuilder = this.categoriaRepository.createQueryBuilder('categoria');
    queryBuilder.orderBy('categoria.nombre', 'ASC');
    return paginate<Categoria>(queryBuilder, options);
  }

  // Buscar una categoría por ID
  async findOne(id_categoria: string): Promise<Categoria | null> {
    try {
      return await this.categoriaRepository.findOne({ where: { id_categoria } });
    } catch (error) {
      console.error('Error al buscar la categoría', error);
      return null;
    }
  }

  // Actualizar categoría
  async update(id_categoria: string, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria | null> {
    try {
      const categoria = await this.categoriaRepository.findOne({ where: { id_categoria } });
      if (!categoria) return null;
      Object.assign(categoria, updateCategoriaDto);
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      console.error('Error al actualizar la categoría', error);
      return null;
    }
  }

  // Eliminar categoría
  async remove(id_categoria: string): Promise<Categoria | null> {
    try {
      const categoria = await this.categoriaRepository.findOne({ where: { id_categoria } });
      if (!categoria) return null;
      return await this.categoriaRepository.remove(categoria);
    } catch (error) {
      console.error('Error al eliminar la categoría', error);
      return null;
    }
  }
}