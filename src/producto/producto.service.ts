import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from '../categoria/categoria.schema';
import { Talla } from '../talla/talla.schema';
import { Color } from '../color/color.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { QueryDto } from 'src/common/dto/query.dto'; 
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Color)
    private readonly colorRepo: Repository<Color>,
    @InjectRepository(Proveedor)
    private readonly proveedorRepo: Repository<Proveedor>,

    @InjectModel(Categoria.name)
    private readonly categoriaModel: Model<Categoria>,

    @InjectModel(Talla.name)
    private readonly tallaModel: Model<Talla>
  ) {}

  // Crear producto con todas las relaciones
  async create(createProductoDto: CreateProductoDto) {
    const categoria = await this.categoriaModel.findById(createProductoDto.id_categoria).exec();
    const talla = await this.tallaModel.findById(createProductoDto.id_talla).exec();
    if (!categoria || !talla) {
      throw new NotFoundException('Categoría o Talla no existen en Mongo');
    }

    const color = await this.colorRepo.findOne({ where: { id_color: createProductoDto.id_color } });
    const proveedor = await this.proveedorRepo.findOne({ where: { id_proveedor: createProductoDto.id_proveedor } });
    if (!color || !proveedor) {
      throw new NotFoundException('Color o Proveedor no existen en Postgres');
    }

    const producto = this.productoRepo.create({
    nombre: createProductoDto.nombre,
    precio: createProductoDto.precio,
    stock_total: createProductoDto.stock_total,
    activo: createProductoDto.activo,
    id_talla: createProductoDto.id_talla,
    categoria_id: createProductoDto.id_categoria,
    color,
    proveedor,
  });


    return this.productoRepo.save(producto);
  }

  // Listar productos con paginación y relaciones
  async findAll(query: QueryDto) {
    const { page = 1, limit = 10, search, searchField, sort, order } = query;

    const qb = this.productoRepo.createQueryBuilder('producto')
      .leftJoinAndSelect('producto.color', 'color')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .leftJoinAndSelect('producto.ventasDetalles', 'ventasDetalles')
      .skip((page - 1) * limit)
      .take(limit);

    // Filtro de búsqueda
    if (search && searchField) {
      qb.andWhere(`producto.${searchField} ILIKE :search`, { search: `%${search}%` });
    }

    // Ordenamiento
    if (sort) {
      qb.orderBy(`producto.${sort}`, order ?? 'ASC');
    }

    const [data, total] = await qb.getManyAndCount();

    // Enriquecer con datos de Mongo
    const enriched = await Promise.all(
      data.map(async (p) => {
        const categoria = await this.categoriaModel.findById(p.categoria_id).exec();
        const talla = await this.tallaModel.findById(p.id_talla).exec();
        return { ...p, categoria, talla };
      }),
    );

    return {
      data: enriched,
      total,
      page,
      limit,
    };
  }

  // Buscar producto por ID
  async findOne(id: string) {
    const producto = await this.productoRepo.findOne({
      where: { id_producto: id },
      relations: ['color', 'proveedor', 'ventasDetalles'],
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    const categoria = await this.categoriaModel.findById(producto.categoria_id).exec();
    const talla = await this.tallaModel.findById(producto.id_talla).exec();

    return {
      ...producto,
      categoria,
      talla,
    };
  }

  // Actualizar producto
  async update(id_producto: string, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepo.findOne({where: {id_producto}});
    if(!producto) throw new NotFoundException('Producto no actualizado');
    Object.assign(producto, updateProductoDto);
    const update = await this.productoRepo.save(producto);
    return new SuccessResponseDto('Producto actualizado correctamente', update);

  }

  // Eliminar producto
  async remove(id_producto:string) {
    const producto = await this.productoRepo.findOne({where: {id_producto}})
    if(!producto) throw new NotFoundException('Producto no eliminado');
    const elimiar = await this.productoRepo.remove(producto);
    return new SuccessResponseDto('Producto creado exitosamente', null);
}
}