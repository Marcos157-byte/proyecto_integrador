import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Proveedor } from './proveedor.entity';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ProveedorService {
     constructor(
        @InjectRepository(Proveedor)
        private readonly proveedorRepository: Repository<Proveedor>,
      ) {}
    
      // Crear proveedor
      async create(dto: Partial<Proveedor>): Promise<SuccessResponseDto | ErrorResponseDto> {
        try {
          const proveedor = this.proveedorRepository.create(dto);
          const saved = await this.proveedorRepository.save(proveedor);
          return new SuccessResponseDto('Proveedor creado correctamente', saved);
        } catch (error) {
          throw new HttpException(
            new ErrorResponseDto('Error al crear el proveedor', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    
      // Listar proveedores con paginación
      async findAll(options: IPaginationOptions): Promise<Pagination<Proveedor>> {
        const queryBuilder = this.proveedorRepository.createQueryBuilder('proveedor');
        queryBuilder.orderBy('proveedor.nombre', 'ASC');
        return paginate<Proveedor>(queryBuilder, options);
      }
    
      // Buscar proveedor por ID
      async findOne(id_proveedor: string): Promise<SuccessResponseDto | ErrorResponseDto> {
        try {
          const proveedor = await this.proveedorRepository.findOne({
            where: { id_proveedor },
            relations: ['productos'],
          });
          if (!proveedor) {
            throw new HttpException(
              new ErrorResponseDto(`Proveedor con id ${id_proveedor} no encontrado`, HttpStatus.NOT_FOUND),
              HttpStatus.NOT_FOUND,
            );
          }
          return new SuccessResponseDto('Proveedor encontrado', proveedor);
        } catch (error) {
          throw new HttpException(
            new ErrorResponseDto('Error al buscar el proveedor', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    
      // Actualizar proveedor
      async update(id_proveedor: string, dto: Partial<Proveedor>): Promise<SuccessResponseDto | ErrorResponseDto> {
        try {
          const proveedor = await this.proveedorRepository.findOne({ where: { id_proveedor } });
          if (!proveedor) {
            throw new HttpException(
              new ErrorResponseDto(`Proveedor con id ${id_proveedor} no encontrado`, HttpStatus.NOT_FOUND),
              HttpStatus.NOT_FOUND,
            );
          }
    
          Object.assign(proveedor, dto);
          const updated = await this.proveedorRepository.save(proveedor);
          return new SuccessResponseDto('Proveedor actualizado correctamente', updated);
        } catch (error) {
          throw new HttpException(
            new ErrorResponseDto('Error al actualizar el proveedor', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    
      // Eliminar proveedor
      async remove(id_proveedor: string): Promise<SuccessResponseDto | ErrorResponseDto> {
        try {
          const proveedor = await this.proveedorRepository.findOne({ where: { id_proveedor } });
          if (!proveedor) {
            throw new HttpException(
              new ErrorResponseDto(`Proveedor con id ${id_proveedor} no encontrado`, HttpStatus.NOT_FOUND),
              HttpStatus.NOT_FOUND,
            );
          }
          await this.proveedorRepository.remove(proveedor);
          return new SuccessResponseDto('Proveedor eliminado correctamente', proveedor);
        } catch (error) {
          throw new HttpException(
            new ErrorResponseDto('Error al eliminar el proveedor', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }

