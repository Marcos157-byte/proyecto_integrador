import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Talla } from '../talla/talla.entity';
import { Color } from '../color/color.entity';
import { Proveedor } from 'src/proveedor/proveedor.entity';
import { Categoria } from '../categoria/categoria.entity';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  // Crear producto
  async create(dto: CreateProductoDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const producto = this.productoRepository.create({
        ...dto,
        talla: { id_talla: dto.id_talla } as Talla,
        color: { id_color: dto.id_color } as Color,
        proveedor: { id_proveedor: dto.id_proveedor } as Proveedor,
        categoria: { id_categoria: dto.id_categoria } as Categoria,
      });
      const saved = await this.productoRepository.save(producto);
      return new SuccessResponseDto('Producto creado correctamente', saved);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al crear el producto', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Listar productos con paginación
  async findAll(options: IPaginationOptions): Promise<Pagination<Producto>> {
    const queryBuilder = this.productoRepository.createQueryBuilder('producto');
    queryBuilder
      .leftJoinAndSelect('producto.talla', 'talla')
      .leftJoinAndSelect('producto.color', 'color')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .orderBy('producto.fecha_creacion', 'DESC');

    return paginate<Producto>(queryBuilder, options);
  }

  // Buscar producto por ID
  async findOne(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const producto = await this.productoRepository.findOne({
        where: { id_producto: id },
        relations: ['talla', 'color', 'proveedor', 'categoria'],
      });
      if (!producto) {
        throw new HttpException(
          new ErrorResponseDto(`Producto con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      return new SuccessResponseDto('Producto encontrado', producto);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar el producto', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar producto
  async update(id: string, dto: UpdateProductoDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const producto = await this.productoRepository.findOne({ where: { id_producto: id } });
      if (!producto) {
        throw new HttpException(
          new ErrorResponseDto(`Producto con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(producto, dto);

      if (dto.id_talla) producto.talla = { id_talla: dto.id_talla } as Talla;
      if (dto.id_color) producto.color = { id_color: dto.id_color } as Color;
      if (dto.id_proveedor) producto.proveedor = { id_proveedor: dto.id_proveedor } as Proveedor;
      if (dto.id_categoria) producto.categoria = { id_categoria: dto.id_categoria } as Categoria;

      const updated = await this.productoRepository.save(producto);
      return new SuccessResponseDto('Producto actualizado correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar el producto', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar producto
  async remove(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const producto = await this.productoRepository.findOne({ where: { id_producto: id } });
      if (!producto) {
        throw new HttpException(
          new ErrorResponseDto(`Producto con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      await this.productoRepository.remove(producto);
      return new SuccessResponseDto('Producto eliminado correctamente', producto);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar el producto', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}