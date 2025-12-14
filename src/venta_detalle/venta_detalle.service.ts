import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VentaDetalle } from './venta_detalle.entity';
import { CreateVentaDetalleDto } from './dto/create-venta_detalle.dto';
import { UpdateVentaDetalleDto } from './dto/update-venta_detalle.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { Venta } from 'src/venta/venta.entity';
import { Producto } from 'src/producto/producto.entity';


@Injectable()
export class VentaDetalleService {
    constructor(
    @InjectRepository(VentaDetalle)
    private readonly ventaDetalleRepository: Repository<VentaDetalle>,
  ) {}

  // Crear detalle de venta
  async create(dto: CreateVentaDetalleDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const detalle = this.ventaDetalleRepository.create({
        cantidad: dto.cantidad,
        precio_unitario: dto.precio_unitario,
        iva: dto.iva,
        subtotal: dto.subtotal,
        venta: { id_venta: dto.id_venta } as Venta,
        producto: { id_producto: dto.id_producto } as Producto,
      });

      const saved = await this.ventaDetalleRepository.save(detalle);
      return new SuccessResponseDto('Detalle de venta creado correctamente', saved);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al crear el detalle de venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Listar todos los detalles
  async findAll(): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const detalles = await this.ventaDetalleRepository.find({
        relations: ['venta', 'producto'],
      });
      return new SuccessResponseDto('Listado de detalles obtenido correctamente', detalles);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al listar los detalles de venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar detalle por ID
  async findOne(id_ventaDetalle: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const detalle = await this.ventaDetalleRepository.findOne({
        where: { id_ventaDetalle },
        relations: ['venta', 'producto'],
      });

      if (!detalle) {
        throw new HttpException(
          new ErrorResponseDto(`Detalle con id ${id_ventaDetalle} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      return new SuccessResponseDto('Detalle de venta encontrado', detalle);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar el detalle de venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar detalle
  async update(id_ventaDetalle: string, dto: UpdateVentaDetalleDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const detalle = await this.ventaDetalleRepository.findOne({ where: { id_ventaDetalle } });
      if (!detalle) {
        throw new HttpException(
          new ErrorResponseDto(`Detalle con id ${id_ventaDetalle} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(detalle, dto);

      if (dto.id_venta) detalle.venta = { id_venta: dto.id_venta } as Venta;
      if (dto.id_producto) detalle.producto = { id_producto: dto.id_producto } as Producto;

      const updated = await this.ventaDetalleRepository.save(detalle);
      return new SuccessResponseDto('Detalle de venta actualizado correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar el detalle de venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar detalle
  async remove(id_ventaDetalle: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const detalle = await this.ventaDetalleRepository.findOne({ where: { id_ventaDetalle } });
      if (!detalle) {
        throw new HttpException(
          new ErrorResponseDto(`Detalle con id ${id_ventaDetalle} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      await this.ventaDetalleRepository.remove(detalle);
      return new SuccessResponseDto('Detalle de venta eliminado correctamente', detalle);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar el detalle de venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


