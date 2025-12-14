import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { Cliente } from 'src/cliente/cliente.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { QueryDto } from 'src/common/dto/query.dto';


@Injectable()
export class VentaService {
    
    constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  // Crear venta
  async create(dto: CreateVentaDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const venta = this.ventaRepository.create({
        fechaVenta: dto.fechaVenta,
        total: dto.total,
        metodoPago: dto.metodoPago,
        cliente: { id_cliente: dto.id_cliente } as Cliente,
        usuario: { id_usuario: dto.id_usuario } as Usuario,
      });

      const saved = await this.ventaRepository.save(venta);
      return new SuccessResponseDto('Venta creada correctamente', saved);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al crear la venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Listar todas las ventas
  async findAll(query: QueryDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const ventas = await this.ventaRepository.find({
        relations: ['cliente', 'usuario'],
        order: { fechaVenta: 'DESC' },
      });
      return new SuccessResponseDto('Listado de ventas obtenido correctamente', ventas);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al listar las ventas', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar venta por ID
  async findOne(id_venta: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const venta = await this.ventaRepository.findOne({
        where: { id_venta },
        relations: ['cliente', 'usuario'],
      });

      if (!venta) {
        throw new HttpException(
          new ErrorResponseDto(`Venta con id ${id_venta} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      return new SuccessResponseDto('Venta encontrada', venta);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar la venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar venta
  async update(id_venta: string, dto: UpdateVentaDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const venta = await this.ventaRepository.findOne({ where: { id_venta } });
      if (!venta) {
        throw new HttpException(
          new ErrorResponseDto(`Venta con id ${id_venta} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(venta, dto);

      if (dto.id_cliente) venta.cliente = { id_cliente: dto.id_cliente } as Cliente;
      if (dto.id_usuario) venta.usuario = { id_usuario: dto.id_usuario } as Usuario;

      const updated = await this.ventaRepository.save(venta);
      return new SuccessResponseDto('Venta actualizada correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar la venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar venta
  async remove(id_venta: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const venta = await this.ventaRepository.findOne({ where: { id_venta } });
      if (!venta) {
        throw new HttpException(
          new ErrorResponseDto(`Venta con id ${id_venta} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      await this.ventaRepository.remove(venta);
      return new SuccessResponseDto('Venta eliminada correctamente', venta);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar la venta', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

