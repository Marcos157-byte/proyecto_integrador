import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Color } from './color.entity';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  // Crear color
  async create(dto: Partial<Color>): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const color = this.colorRepository.create(dto);
      const saved = await this.colorRepository.save(color);
      return new SuccessResponseDto('Color creado correctamente', saved);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al crear el color', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Listar colores con paginación
  async findAll(options: IPaginationOptions): Promise<Pagination<Color>> {
    const queryBuilder = this.colorRepository.createQueryBuilder('color');
    queryBuilder.orderBy('color.color', 'ASC');
    return paginate<Color>(queryBuilder, options);
  }

  // Buscar color por ID
  async findOne(id_color: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const color = await this.colorRepository.findOne({
        where: { id_color },
        relations: ['productos'],
      });
      if (!color) {
        throw new HttpException(
          new ErrorResponseDto(`Color con id ${id_color} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      return new SuccessResponseDto('Color encontrado', color);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar el color', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar color
  async update(id_color: string, dto: Partial<Color>): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const color = await this.colorRepository.findOne({ where: { id_color } });
      if (!color) {
        throw new HttpException(
          new ErrorResponseDto(`Color con id ${id_color} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(color, dto);
      const updated = await this.colorRepository.save(color);
      return new SuccessResponseDto('Color actualizado correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar el color', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar color
  async remove(id_color: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const color = await this.colorRepository.findOne({ where: { id_color } });
      if (!color) {
        throw new HttpException(
          new ErrorResponseDto(`Color con id ${id_color} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      await this.colorRepository.remove(color);
      return new SuccessResponseDto('Color eliminado correctamente', color);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar el color', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}