import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>
  ) {}

  async create(createRolDto: CreateRolDto) {
    const rol = this.rolRepository.create(createRolDto);
    const saved = await this.rolRepository.save(rol);
    if(!rol) throw new NotFoundException('Rol no creado');
    return new SuccessResponseDto('Rol creado correctamente', saved);

  }
  async findAll(query: QueryDto) {
    const {page,limit,search,searchField,sort,order} = query

    const qb = this.rolRepository.createQueryBuilder('rol')
    .skip((page-1)*limit)
    .take(limit);
    if(search && searchField) {
      qb.andWhere(`rol.${searchField} LIKE: search`, {search: `${search}`});

    }
    if(sort) {
      qb.orderBy(`rol.${sort}`, order ?? `ASC`);
    }
    const[data,total] = await qb.getManyAndCount();
    return new SuccessResponseDto('Rol obtenidos correctamente', {
      data,
      total,
      page,
      limit
    });
  }
  async findOne(id_rol:string) {
    const rol = await this.rolRepository.findOne({where: {id_rol}});
    if(!rol)  throw new NotFoundException('Rol no encontrados');
    return new SuccessResponseDto('Rol obtenidos correctamente', rol);
  }

  async update(id_rol: string, updateRolDto:UpdateRolDto) {
    const rol = await this.rolRepository.findOne({where: {id_rol}});
    if(!rol) throw new NotFoundException('Rol no encontrado');

    Object.assign(rol, updateRolDto);
    const update = await this.rolRepository.save(rol);
    return new SuccessResponseDto('Rol actualizado correctamente', update);
  }
  async remove (id_rol: string) {
    const rol = await this.rolRepository.findOne({where: {id_rol}});
    if(!rol) throw new NotFoundException('Rol no encontrado');
    const elimiar = await this.rolRepository.remove(rol);
    return new SuccessResponseDto('Rol eliminado corecctamente', null);
  }


}