import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Rol } from './rol.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  // Crear rol
  async create(createRolDto: CreateRolDto): Promise<Rol | null> {
    try {
      const rol = this.rolRepository.create(createRolDto);
      return await this.rolRepository.save(rol);
    } catch (error) {
      console.error('Error al crear el rol', error);
      return null;
    }
  }

  // Listar roles con paginación
  async findAll(options: IPaginationOptions): Promise<Pagination<Rol>> {
    const queryBuilder = this.rolRepository.createQueryBuilder('rol');
    queryBuilder.orderBy('rol.rol', 'ASC');
    return paginate<Rol>(queryBuilder, options);
  }

  // Buscar un rol por ID
  async findOne(id_rol: string): Promise<Rol | null> {
    try {
      return await this.rolRepository.findOne({ where: { id_rol } });
    } catch (error) {
      console.error('Error al buscar el rol', error);
      return null;
    }
  }

  // Actualizar rol
  async update(id_rol: string, updateRolDto: UpdateRolDto): Promise<Rol | null> {
    try {
      const rol = await this.rolRepository.findOne({ where: { id_rol } });
      if (!rol) return null;
      Object.assign(rol, updateRolDto);
      return await this.rolRepository.save(rol);
    } catch (error) {
      console.error('Error al actualizar el rol', error);
      return null;
    }
  }

  // Eliminar rol
  async remove(id_rol: string): Promise<Rol | null> {
    try {
      const rol = await this.rolRepository.findOne({ where: { id_rol } });
      if (!rol) return null;
      return await this.rolRepository.remove(rol);
    } catch (error) {
      console.error('Error al eliminar el rol', error);
      return null;
    }
  }
}