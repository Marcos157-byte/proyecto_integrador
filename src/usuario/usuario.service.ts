import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UptateUsuarioDto } from './dto/update-usuario.dto';
import { Empleado } from 'src/empleado/empleado.entity';
import { SuccessResponseDto} from 'src/common/dto/response.dto';
import * as bcrypt  from 'bcrypt'
import { QueryDto } from 'src/common/dto/query.dto';
import { RolUsuario } from 'src/rol_usuario/rol_usuario.entity';
@Injectable()
export class UsuarioService {
    constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>
  ) {}
  async create(createUsuarioDto:CreateUsuarioDto) {
    const empleado = await this.empleadoRepository.findOne({where: {id_empleado: createUsuarioDto.id_empleado }})
    if(!empleado) throw new NotFoundException('Empleado con encontrado para asignar el usuario');
    const passwordhash = await bcrypt.hash(createUsuarioDto.password,10);
    const usuario = this.usuarioRepository.create({...createUsuarioDto,password:passwordhash,empleado});
    const saved = await this.usuarioRepository.save(usuario);
    if (createUsuarioDto.rolesIds && createUsuarioDto.rolesIds.length > 0) {
    const rolUsuarios: RolUsuario[] = createUsuarioDto.rolesIds.map(idRol => {
      const ru = new RolUsuario();
      ru.usuario = saved;
      ru.rol = { id_rol: idRol } as any; // 👈 solo necesitas el id del rol
      return ru;
    });

    await this.usuarioRepository.manager.save(RolUsuario, rolUsuarios);
  }

    if(!usuario) throw new NotFoundException('Usuario no registrado');

    return new SuccessResponseDto('Usuario creado correctamente', saved);

  }
  async  findAll(query:QueryDto) {
    
    const{page,limit,search,searchField,sort,order} = query;
    const qb = this.usuarioRepository.createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.empleado', 'empleado')
    .leftJoinAndSelect('usuario.rolUsuarios','rolUsuarios')
    .leftJoinAndSelect('rolUsuarios.rol', 'rol')
    .skip((page -1) * limit)
    .take(limit);

    if(search && searchField) {
      qb.andWhere(`usuario.${searchField} LIKE:search`, {search: `${search}`});

    }
    if(sort) {
      qb.orderBy(`usuario.${sort}`, order ?? `ASC`);
    }
    const [data,total] = await qb.getManyAndCount();
    return new SuccessResponseDto('Usuario obtenido correctamente',{
      data,
      total,
      page,
      limit
    })

  }
  async findByEmail(email: string){
    return this.usuarioRepository.findOne({
    where: { email },
    relations: ['empleado', 'rolUsuarios', 'rolUsuarios.rol'],
  });
}

  async update (id_usuario:string, updateUsuarioDto:UptateUsuarioDto){
    const usuario = await this.usuarioRepository.findOne({where: {id_usuario}});
    if(!usuario) throw new NotFoundException('Usuario no encontrado');
    Object.assign(usuario,updateUsuarioDto);
    const update = await this.usuarioRepository.save(usuario);
    return new SuccessResponseDto('Usuario actualizado correctamente', update);
  }

  async findOne(id_usuario:string) {
    const usuario = await this.usuarioRepository.findOne({where: {id_usuario},relations: ['empleado', 'rolUsuarios', 'rolUsuarios.rol']});
    if(!usuario) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario encontrado correctamente', usuario);
  }

  async remove(id_usuario: string) {
    const usuario = await this.usuarioRepository.findOne({where: {id_usuario}});
    if(!usuario) throw new NotFoundException('Usuario no eliminado');
    const eliminar = await this.usuarioRepository.remove(usuario);
    return new SuccessResponseDto('Usuario eliminado correctamente', null);
  }
}