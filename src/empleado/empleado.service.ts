import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Empleado } from "./empleado.entity";
import { QueryDto } from "src/common/dto/query.dto";
import { CreateEmpleadoDto } from "./dto/create-empleado.dto";
import { UpdateEmpleadoDto } from "./dto/update-empleado.dto";
import { SuccessResponseDto } from "src/common/dto/response.dto";

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository:Repository<Empleado>
  ) {}

  async create(createEmpleadoDto:CreateEmpleadoDto){
    const empleado = this.empleadoRepository.create(createEmpleadoDto);
    const saved = await this.empleadoRepository.save(empleado)
    if(!empleado) throw new NotFoundException('Empleado no creado');

    return new SuccessResponseDto('Empleado creado exitosamente', saved);
  }

  async findAll(query: QueryDto) {
    const {page,limit,search,searchField,sort,order} = query;
    const qb = this.empleadoRepository.createQueryBuilder('empleado')
    .skip((page -1) * limit)
    .take(limit);
    if(search && searchField) {
      qb.andWhere(`empleado.${searchField} LIKE: search`, {search: `${search}`});

    }
    if(sort) {
      qb.orderBy(`empleado.${sort}`, order ?? `ASC`);

    }
    const [data, total] = await qb.getManyAndCount();

    return new SuccessResponseDto('Empleado obtenidos correctamente', {
      data,
      total,
      page,
      limit
    });
  }
  async findOne(id_empleado:string) {
    const empleado = await this.empleadoRepository.findOne({where: {id_empleado}});
    if(!empleado) throw new NotFoundException('Empleado no encontrado');
    return new SuccessResponseDto('Empleado encontrado correctamente', empleado);

  }
  async update(id_empleado:string,updateEmpleadoDto:UpdateEmpleadoDto) {
    const empleado = await this.empleadoRepository.findOne({where: {id_empleado}});
    if(!empleado) throw new NotFoundException('Empleado no encontrado');
    Object.assign(empleado,updateEmpleadoDto);
    const update = await this.empleadoRepository.save(empleado);
    return new SuccessResponseDto('Empleado actualizado correctamente', update);

  }
  async remove(id_empleado: string){
    const empleado = await this.empleadoRepository.findOne({where: {id_empleado}});
    if(!empleado) throw new NotFoundException('Empleado no encontrado');
    const eliminar = await this.empleadoRepository.remove(empleado);
    return new SuccessResponseDto('Empleado eliminado correctamente', null);
  }

}