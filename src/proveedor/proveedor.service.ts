import { Injectable, NotFoundException, Search } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QueryDto } from "src/common/dto/query.dto";
import { CreateProveedorDto } from "./dto/create-proveedor.dto";
import { UpdateProveedorDto } from "./dto/update-proveedor.dto";
import { SuccessResponseDto } from "src/common/dto/response.dto";
import { Proveedor } from "./proveedor.entity";

@Injectable()

export class ProveedorService{

  constructor(@InjectRepository(Proveedor)
  private readonly proveedorRepository: Repository<Proveedor>) {}

  async create(createproveedorDto:  CreateProveedorDto) {
    const proveedor = this.proveedorRepository.create(createproveedorDto);
    const saved = await this.proveedorRepository.save(proveedor);
    if(!proveedor) throw new NotFoundException('Provvedor no creado');
    return new SuccessResponseDto('Proveedor creado correctamente', saved);
  }

  async findAll(query: QueryDto) {
    const {page,limit,search,searchField,sort,order} = query;

    const qb = this.proveedorRepository.createQueryBuilder('proveedor')
    .skip((page -1) * limit)
    .take(limit);
    if(search && searchField) {
      qb.andWhere(`proveedor.${searchField} LIKE: search`, {search: `${search}`});

    }
    if (sort) {
      qb.orderBy(`proveedor.${sort}`, order ?? `ASC`);
    }
    const [data, total] = await qb.getManyAndCount();
    return new SuccessResponseDto('Proveedores obtenidos correctamente', {
      data,
      total,
      page,
      limit
    });

  }
  async findOne(id_proveedor:string) {
    const proveedor = await this.proveedorRepository.findOne({where: {id_proveedor}, relations: ['productos']})
    if(!proveedor) throw new NotFoundException('Proveedor no encontraod');
    return new SuccessResponseDto('Proveedor encontrado exitosamente',proveedor);
  }
  async update(id_proveedor:string, updateProveedorDto) {
    const proveedor = await this.proveedorRepository.findOne({where: {id_proveedor}});
    if(!proveedor) throw new NotFoundException('Proveedor no encontrado');
    Object.assign(proveedor,updateProveedorDto);
    const update = await this.proveedorRepository.save(proveedor);
    return new SuccessResponseDto('Proveedor actualizado correctamente', update);


  }

  async remove(id_proveedor:string) {
    const proveedor = await this.proveedorRepository.findOne({where: {id_proveedor}});
    if(!proveedor) throw new NotFoundException('Proveedor no eliminado');
    const eliminar = await this.proveedorRepository.remove(proveedor);
    return new SuccessResponseDto('Proveedor elinimado correctamente',null);
  }
}