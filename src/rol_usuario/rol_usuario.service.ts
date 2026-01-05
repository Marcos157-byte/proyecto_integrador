import { Injectable,  NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { RolUsuario } from './rol_usuario.entity';
import { CreateRolUsuarioDto } from './dto/create-rol_usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol_usuario.dto';
import { Rol } from 'src/rol/rol.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { SuccessResponseDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';


@Injectable()
export class RolUsuarioService {
    constructor(
    @InjectRepository(RolUsuario)
    private readonly rolUsuarioRepository: Repository<RolUsuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) {}
  
  async create(createRolUsuarioDto: CreateRolUsuarioDto) {
    const rol = await this.rolRepository.findOne({where: {id_rol:createRolUsuarioDto.id_rol}});
    if(!rol) throw new NotFoundException('Rol no encontrado');
    const usuario = await this.usuarioRepository.findOne({where: {id_usuario: createRolUsuarioDto.id_usuario}})
    if(!usuario) throw new NotFoundException('Usuario no encontrado');
    const rolUsuario =  this.rolUsuarioRepository.create({rol,usuario});
    const saved = await this.rolUsuarioRepository.save(rolUsuario);
    if(!saved)  throw new NotFoundException('Asignacion del rol no creado');
    return new SuccessResponseDto('Rol asignado correctamente', saved);
  }
  async findAll(query:QueryDto){
    const {page,limit,search,searchField,sort,order} = query;
    const qb = this.rolUsuarioRepository.createQueryBuilder('rolUsuario')
    .leftJoinAndSelect('rolUsuario', 'rol')
    .leftJoinAndSelect('rolUsuario', 'usuario')
    .skip((page -1)*limit)
    .take(limit);

    if(search && searchField) {
      qb.andWhere(`rolUsuario.${searchField} LIKE: search`, {search: `${search}`});
    }

    if(sort) {
      qb.orderBy(`rolUsuario.${sort}`, order ?? `ASC`);
    }
    const [data,total] = await qb.getManyAndCount();
    if(!data || data.length === 0) throw new NotFoundException('No se encontro asignacion de rol')
    return new SuccessResponseDto('Asignaciones obtenidas correctamente', {
      data,
      total,
      page,
      limit});
  }

  async findOne(id_rolUsuario: string) {
    const rolUsuario = await this.rolUsuarioRepository.findOne({where: {id_rolUsuario}})
    if(!rolUsuario) throw new NotFoundException('Asingacion de rol no encontrado');
    return new SuccessResponseDto('Asignacion de rol encontrado',rolUsuario);

  }
  async update(id_rolUsuario: string, updateRolUsuarioDto: UpdateRolUsuarioDto) {
    const rolUsuario = await this.rolUsuarioRepository.findOne({where: {id_rolUsuario}});
    if(!rolUsuario) throw new NotFoundException('Asignacion de rol no actualizada');
    Object.assign(rolUsuario,updateRolUsuarioDto);
    const update = await this.rolUsuarioRepository.save(rolUsuario);
    return new SuccessResponseDto('Asignacion de rol actualizada', update);
  }
  async remove(id_rolUsuario:string) {
    const rolUsuario = await this.rolUsuarioRepository.findOne({where: {id_rolUsuario}});
    if(!rolUsuario) throw new NotFoundException('Asigancion de rol no eliminada');
    const eliminar  = await this.rolUsuarioRepository.remove(rolUsuario);
    return new SuccessResponseDto('Asignacion de rol eliminada', null);
  }
}