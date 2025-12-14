import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { RolUsuario } from './rol_usuario.entity';
import { CreateRolUsuarioDto } from './dto/create-rol_usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol_usuario.dto';
import { Rol } from 'src/rol/rol.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';


@Injectable()
export class RolUsuarioService {
    constructor(
    @InjectRepository(RolUsuario)
    private readonly rolUsuarioRepository: Repository<RolUsuario>,
  ) {}

  // Crear relación RolUsuario
  async create(dto: CreateRolUsuarioDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const rolUsuario = this.rolUsuarioRepository.create({
        rol: { id_rol: dto.id_rol } as Rol,
        usuario: { id_usuario: dto.id_usuario } as Usuario,
      });
      const saved = await this.rolUsuarioRepository.save(rolUsuario);
      return new SuccessResponseDto('Relación rol-usuario creada correctamente', saved);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al crear la relación rol-usuario', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Listar relaciones con paginación
  async findAll(options: IPaginationOptions): Promise<Pagination<RolUsuario>> {
    const queryBuilder = this.rolUsuarioRepository.createQueryBuilder('rolUsuario');
    queryBuilder
      .leftJoinAndSelect('rolUsuario.rol', 'rol')
      .leftJoinAndSelect('rolUsuario.usuario', 'usuario')
      .orderBy('rolUsuario.id_rolUsuario', 'ASC');

    return paginate<RolUsuario>(queryBuilder, options);
  }

  // Buscar relación por ID
  async findOne(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const rolUsuario = await this.rolUsuarioRepository.findOne({
        where: { id_rolUsuario: id },
        relations: ['rol', 'usuario'],
      });
      if (!rolUsuario) {
        throw new HttpException(
          new ErrorResponseDto(`Relación rol-usuario con id ${id} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      return new SuccessResponseDto('Relación rol-usuario encontrada', rolUsuario);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar la relación rol-usuario', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar relación
  async update(id: string, dto: UpdateRolUsuarioDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const rolUsuario = await this.rolUsuarioRepository.findOne({ where: { id_rolUsuario: id } });
      if (!rolUsuario) {
        throw new HttpException(
          new ErrorResponseDto(`Relación rol-usuario con id ${id} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      if (dto.id_rol) rolUsuario.rol = { id_rol: dto.id_rol } as Rol;
      if (dto.id_usuario) rolUsuario.usuario = { id_usuario: dto.id_usuario } as Usuario;

      const updated = await this.rolUsuarioRepository.save(rolUsuario);
      return new SuccessResponseDto('Relación rol-usuario actualizada correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar la relación rol-usuario', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar relación
  async remove(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const rolUsuario = await this.rolUsuarioRepository.findOne({ where: { id_rolUsuario: id } });
      if (!rolUsuario) {
        throw new HttpException(
          new ErrorResponseDto(`Relación rol-usuario con id ${id} no encontrada`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      await this.rolUsuarioRepository.remove(rolUsuario);
      return new SuccessResponseDto('Relación rol-usuario eliminada correctamente', rolUsuario);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar la relación rol-usuario', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


