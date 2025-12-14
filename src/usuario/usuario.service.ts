import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UptateUsuarioDto } from './dto/update-usuario.dto';
import { Empleado } from 'src/empleado/empleado.entity';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class UsuarioService {
    constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Crear usuario
  async create(dto: CreateUsuarioDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const usuario = this.usuarioRepository.create({
        ...dto,
        empleado: { id_empleado: dto.id_empleado } as Empleado,
      });
      const saved = await this.usuarioRepository.save(usuario);
      return new SuccessResponseDto('Usuario creado correctamente', saved);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al crear el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Listar usuarios con paginación
  async findAll(options: IPaginationOptions): Promise<Pagination<Usuario>> {
    const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario');
    queryBuilder
      .leftJoinAndSelect('usuario.empleado', 'empleado')
      .orderBy('usuario.nombre', 'ASC');

    return paginate<Usuario>(queryBuilder, options);
  }

  // Buscar usuario por ID
  async findOne(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id_usuario: id },
        relations: ['empleado'],
      });
      if (!usuario) {
        throw new HttpException(
          new ErrorResponseDto(`Usuario con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      return new SuccessResponseDto('Usuario encontrado', usuario);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al buscar el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar usuario
  async update(id: string, dto: UptateUsuarioDto): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: id } });
      if (!usuario) {
        throw new HttpException(
          new ErrorResponseDto(`Usuario con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(usuario, dto);

      if (dto.id_empleado) usuario.empleado = { id_empleado: dto.id_empleado } as Empleado;

      const updated = await this.usuarioRepository.save(usuario);
      return new SuccessResponseDto('Usuario actualizado correctamente', updated);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al actualizar el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar usuario
  async remove(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: id } });
      if (!usuario) {
        throw new HttpException(
          new ErrorResponseDto(`Usuario con id ${id} no encontrado`, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usuarioRepository.remove(usuario);
      return new SuccessResponseDto('Usuario eliminado correctamente', usuario);
    } catch (error) {
      throw new HttpException(
        new ErrorResponseDto('Error al eliminar el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


