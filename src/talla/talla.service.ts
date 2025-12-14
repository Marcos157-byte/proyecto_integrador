import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Talla } from './talla.entity';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class TallaService {
  constructor(
    @InjectRepository(Talla)
    private readonly tallaRepository: Repository<Talla>,
  ) {}

  // Crear talla
  async create(dto: Partial<Talla>): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const talla = this.tallaRepository.create(dto);
      const saved = await this.tallaRepository.save(talla);
      return new SuccessResponseDto('Talla creada correctamente', saved);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al crear la talla', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Listar tallas con paginación
  async findAll(options: IPaginationOptions): Promise<Pagination<Talla>> {
    const queryBuilder = this.tallaRepository.createQueryBuilder('talla');
    queryBuilder.orderBy('talla.talla', 'ASC');
    return paginate<Talla>(queryBuilder, options);
  }

  // Buscar talla por ID
  async findOne(id_talla: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const talla = await this.tallaRepository.findOne({
        where: { id_talla },
        relations: ['productos'],
      });
      if (!talla) {
        throw new HttpException(
          new ErrorResponseDto(`Talla con id ${id_talla} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      return new SuccessResponseDto('Talla encontrada', talla);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar la talla', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar talla
  async update(id_talla: string, dto: Partial<Talla>): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const talla = await this.tallaRepository.findOne({ where: { id_talla } });
      if (!talla) {
        throw new HttpException(
          new ErrorResponseDto(`Talla con id ${id_talla} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(talla, dto);
      const updated = await this.tallaRepository.save(talla);
      return new SuccessResponseDto('Talla actualizada correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar la talla', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar talla
  async remove(id_talla: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const talla = await this.tallaRepository.findOne({ where: { id_talla } });
      if (!talla) {
        throw new HttpException(
          new ErrorResponseDto(`Talla con id ${id_talla} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      await this.tallaRepository.remove(talla);
      return new SuccessResponseDto('Talla eliminada correctamente', talla);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar la talla', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}