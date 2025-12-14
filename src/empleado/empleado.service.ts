import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Empleado } from './empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Injectable()


@Injectable()
export class EmpleadoService {
    constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  // Crear empleado
  async create(dto: CreateEmpleadoDto): Promise<Empleado> {
  try {
    const empleado = this.empleadoRepository.create(dto);
    return await this.empleadoRepository.save(empleado);
  } catch (error) {
    throw new HttpException(
      new ErrorResponseDto('Error al crear el empleado', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


  // Listar empleados con paginación y filtros
  async findAll(query: QueryDto): Promise<Pagination<Empleado>> {
    try {
      const qb: SelectQueryBuilder<Empleado> = this.empleadoRepository.createQueryBuilder('empleado');

      // 🔹 Filtro por búsqueda
      if (query.search && query.searchField) {
        qb.andWhere(`empleado.${query.searchField} ILIKE :search`, { search: `%${query.search}%` });
      }

      // 🔹 Ordenación
      if (query.sort) {
        qb.orderBy(`empleado.${query.sort}`, query.order ?? 'ASC');
      } else {
        qb.orderBy('empleado.nombre', 'ASC');
      }

      // 🔹 Paginación
      return paginate<Empleado>(qb, {
        page: query.page,
        limit: query.limit,
      });
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al listar los empleados', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar empleado por ID
  async findOne(id_empleado: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const empleado = await this.empleadoRepository.findOne({
        where: { id_empleado },
        relations: ['usuarios'],
      });

      if (!empleado) {
        throw new HttpException(
          new ErrorResponseDto(`Empleado con id ${id_empleado} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      return new SuccessResponseDto('Empleado encontrado correctamente', empleado);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar el empleado', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar empleado
  async update(id_empleado: string, dto: UpdateEmpleadoDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const empleado = await this.empleadoRepository.findOne({ where: { id_empleado } });
      if (!empleado) {
        throw new HttpException(
          new ErrorResponseDto(`Empleado con id ${id_empleado} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(empleado, dto);
      const updated = await this.empleadoRepository.save(empleado);
      return new SuccessResponseDto('Empleado actualizado correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar el empleado', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar empleado
  async remove(id_empleado: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const empleado = await this.empleadoRepository.findOne({ where: { id_empleado } });
      if (!empleado) {
        throw new HttpException(
          new ErrorResponseDto(`Empleado con id ${id_empleado} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      await this.empleadoRepository.remove(empleado);
      return new SuccessResponseDto('Empleado eliminado correctamente', empleado);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar el empleado', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
