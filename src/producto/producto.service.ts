import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
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
  ) { }

  // ✅ Crear producto estandarizado
  async create(dto: CreateProductoDto) {
    const talla = await this.tallaModel.findOne({ id_talla: dto.id_talla });
    if (!talla) throw new NotFoundException("Talla no encontrada");

    const categoria = await this.categoriaModel.findOne({ id_categoria: dto.id_categoria });
    if (!categoria) throw new NotFoundException("Categoría no encontrada");

    const proveedor = await this.proveedorRepo.findOne({ where: { id_proveedor: dto.id_proveedor } });
    if (!proveedor) throw new NotFoundException("Proveedor no encontrado");

    const color = await this.colorRepo.findOne({ where: { id_color: dto.id_color } });
    if (!color) throw new NotFoundException("Color no encontrado");

    const producto = this.productoRepo.create({
      ...dto,
      proveedor,
      color,
    });

    const saved = await this.productoRepo.save(producto);
    return new SuccessResponseDto('Producto creado con éxito', saved);
  }

  // ✅ Listar productos corregido (Error de sintaxis const = result eliminado)
  async findAll(query: QueryDto) {
    const { page = 1, limit = 10, search, searchField, sort, order } = query;

    const qb = this.productoRepo.createQueryBuilder('producto')
      .leftJoinAndSelect('producto.color', 'color')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .skip((page - 1) * limit)
      .take(limit);

    if (search && searchField) {
      qb.andWhere(`producto.${searchField} ILIKE :search`, { search: `%${search}%` });
    }

    if (sort) {
      qb.orderBy(`producto.${sort}`, order ?? 'ASC');
    }

    const [data, total] = await qb.getManyAndCount();

    // Enriquecer con datos de Mongo
    const enriched = await Promise.all(
      data.map(async (p) => {
        const categoria = await this.categoriaModel.findOne({ id_categoria: p.id_categoria }).lean();
        const talla = await this.tallaModel.findOne({ id_talla: p.id_talla }).lean();
        return { ...p, categoria, talla };
      }),
    );

    const result = {
      data: enriched,
      total,
      page: Number(page),
      limit: Number(limit),
    };

    return new SuccessResponseDto('Productos listados con éxito', result);
  }

  // ✅ Buscar uno estandarizado
  async findOne(id: string) {
    const producto = await this.productoRepo.findOne({
      where: { id_producto: id },
      relations: ['color', 'proveedor'],
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    const categoria = await this.categoriaModel.findOne({ id_categoria: producto.id_categoria }).lean();
    const talla = await this.tallaModel.findOne({ id_talla: producto.id_talla }).lean();

    const data = { ...producto, categoria, talla };
    return new SuccessResponseDto('Producto encontrado', data);
  }

  // ✅ Update estandarizado
  async update(id_producto: string, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepo.findOne({ where: { id_producto } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    Object.assign(producto, updateProductoDto);
    const updated = await this.productoRepo.save(producto);

    return new SuccessResponseDto('Producto actualizado correctamente', updated);
  }

  // ✅ Remove estandarizado
  async remove(id_producto: string) {
    const producto = await this.productoRepo.findOne({ where: { id_producto } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    await this.productoRepo.remove(producto);
    return new SuccessResponseDto('Producto eliminado correctamente', null);
  }

  // ... (getDashboardStats y getStockCriticoDetallado se mantienen igual pero asegúrate de que el controller los envuelva en SuccessResponseDto si es necesario)


  async getDashboardStats() {
    // 1. Contar total de productos
    const totalProductos = await this.productoRepo.count();

    // 2. Calcular valor total del inventario
    const result = await this.productoRepo
      .createQueryBuilder('producto')
      .select('SUM(producto.precio * producto.stock_total)', 'totalValue')
      .getRawOne();

    // 3. Obtener productos más vendidos (Top 5)
    const masVendidos = await this.productoRepo.createQueryBuilder('producto')
      .leftJoin('producto.ventasDetalles', 'detalle')
      .select('producto.nombre', 'nombre')
      .addSelect('COALESCE(SUM(detalle.cantidad), 0)', 'total_vendido')
      .groupBy('producto.id_producto')
      .addGroupBy('producto.nombre')
      .orderBy('SUM(detalle.cantidad)', 'DESC')
      .limit(5)
      .getRawMany();

    // Retornamos el formato que espera tu SuccessResponseDto
    return {
      totalProductos,
      valorInventario: parseFloat(result.totalValue || 0),
      masVendidos
    };
  }

  async getStockAlerts() {
    // Buscamos productos con stock menor a 5 unidades (Nivel crítico)
    const productosBajos = await this.productoRepo.find({
      where: { stock_total: LessThan(5) },
      order: { stock_total: 'ASC' }
    });

    // Enriquecemos con la talla de Mongo para que la alerta sea útil
    const alertas = await Promise.all(
      productosBajos.map(async (p) => {
        const talla = await this.tallaModel.findOne({ id_talla: p.id_talla }).lean();
        return {
          nombre: p.nombre,
          stock: p.stock_total,
          talla: talla?.nombre || 'N/A'
        };
      })
    );

    return alertas;
  }
}


