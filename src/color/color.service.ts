import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Color } from "./color.entity";
import { QueryDto } from "src/common/dto/query.dto";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";
import { SuccessResponseDto } from "src/common/dto/response.dto";
import { Repository } from "typeorm";
import _ from "mongoose-paginate-v2";

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color> ) {}
  async create(createColorDto: CreateColorDto) {
    const color = this.colorRepository.create(createColorDto);
    const saved = await this.colorRepository.save(color);
    return new SuccessResponseDto('Color creado correctamente', saved);

  }
  async findAll(query:QueryDto) {
    const {page, limit, search,searchField,sort,order} = query;

    const qb = this.colorRepository.createQueryBuilder('color')
    .skip((page -1) * limit)
    .take(limit)
    if(search && searchField) {
      qb.andWhere(`color.${searchField} LIKE :search`, {search: `${search}`});
    }
    if(sort) {
      qb.orderBy(`color.${sort}`, order ?? 'ASC');

    }
    const [data, total] = await qb.getManyAndCount();
    return new SuccessResponseDto('Color registado correctamente', {
      data,
      total,
      page,
      limit
    });
  }
  
  async findOne(id_color:string) {
    const color = await this.colorRepository.findOne({where: {id_color}});

    if(!color) throw new NotFoundException('Color no encontrado');
    return new SuccessResponseDto('Color encontrado correctamente', color);

  }
  async update(id_color:string, updateColorDto:UpdateColorDto) {
    const color = await this.colorRepository.findOne({where: {id_color}});
    if(!color) throw new NotFoundException('Color no encontrado');
    Object.assign(color, updateColorDto);
    const update = await this.colorRepository.save(color);
    return new SuccessResponseDto('Color actializado correctamente', update);
  }
  async remove(id_color: string) {
    const color = await this.colorRepository.findOne({where: {id_color}})
    if(!color) throw new NotFoundException('Color no encontrado');
    const eliminar = await this.colorRepository.remove(color);
    return new SuccessResponseDto('Color eliminado correctamente',null)
  }
  

  

}