import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { MovimientoInventario } from './movimiento_inventario.schema';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento_inventario.dto';
import { UpdateMovimientoInventarioDto } from './dto/update-movimiento_inventario.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class MovimientoInventarioService {
  constructor(
    @InjectModel(MovimientoInventario.name)
    private readonly movimientoModel: mongoose.PaginateModel<MovimientoInventario>,
  ) {}

  // Crear movimiento
  async create(dto: CreateMovimientoInventarioDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const nuevoMovimiento = new this.movimientoModel({
        id_producto: dto.id_producto,
        id_usuario: dto.id_usuario,
        tipoMovimiento: dto.tipoMovimiento,
        cantidad: dto.cantidad,
        fechaMovimiento: dto.fechaMovimiento,
        observaciones: dto.observaciones,
        motivo: dto.motivo,
      });

      const saved = await nuevoMovimiento.save();
      return new SuccessResponseDto('Movimiento creado correctamente', saved);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al crear el movimiento', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Listar movimientos con paginación
  async findAll(page: number = 1, limit: number = 10): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const options = {
        page,
        limit,
        sort: { fechaMovimiento: -1 },
      };

      const result = await this.movimientoModel.paginate({}, options);
      return new SuccessResponseDto('Lista de movimientos con paginación', result);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al listar movimientos', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar movimiento por ID
  async findOne(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const movimiento = await this.movimientoModel.findById(id).exec();

      if (!movimiento) {
        throw new HttpException(
          new ErrorResponseDto(`Movimiento con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      return new SuccessResponseDto('Movimiento encontrado', movimiento);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar el movimiento', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar movimiento
  async update(id: string, dto: UpdateMovimientoInventarioDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const updated = await this.movimientoModel
        .findByIdAndUpdate(id, dto, { new: true })
        .exec();

      if (!updated) {
        throw new HttpException(
          new ErrorResponseDto(`Movimiento con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      return new SuccessResponseDto('Movimiento actualizado correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar el movimiento', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar movimiento
  async remove(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const deleted = await this.movimientoModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException(
          new ErrorResponseDto(`Movimiento con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      return new SuccessResponseDto('Movimiento eliminado correctamente', deleted);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar el movimiento', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}