import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {  Model, PaginateModel } from "mongoose";
import { Categoria } from "./categoria.schema";
import { CreateCategoriaDto } from "./dto/create-categoria.dto";
import { UpdateCategoriaDto } from "./dto/update-categoria.dto";
import { SuccessResponseDto } from "src/common/dto/response.dto";
import { QueryDto } from "src/common/dto/query.dto";


@Injectable()
export class CategoriaService {
  constructor(
    @InjectModel(Categoria.name)
    private readonly categoriaModel: Model<Categoria>
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = new this.categoriaModel(createCategoriaDto);
    const saved = await categoria.save();
    return new SuccessResponseDto('Categoria creada correctamente', saved)
  }

  async findAll(query: QueryDto) {
    const {page, limit, search,searchField,sort,order} = query;

    const options: any = {
      page,
      limit,
      sort: sort ? { [sort]: order ?? 'ASC'} : undefined,
    };
    const filter: any = {};
    if(search && searchField) {
      filter[searchField] = {$regex: search, $options: 'i'};
    }

    const result =  await (this.categoriaModel as PaginateModel<Categoria>).paginate(filter, options);


    return new SuccessResponseDto('Categorias obtenidas correctamente', result);
  }
  async findOne(id_categoria: string) {
    const categoria = await this.categoriaModel.findOne({id_categoria}).exec();
    if(!categoria) throw new NotFoundException('Categoria no encontrada');
    return new SuccessResponseDto('Categoria encontrada', categoria);
  }

  async update(id_categoria:string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.categoriaModel.findOneAndUpdate(
      {id_categoria: id_categoria},
      updateCategoriaDto,
      {new: true},
    ).exec();
    if (!categoria) throw new NotFoundException('Categoria no encontrada');
    return new SuccessResponseDto('Categoria actualizada correctamente', categoria);
  }

  async remove(id_categoria: string) {
    const categoria = await this.categoriaModel.findOneAndDelete({id_categoria}).exec();
    if(!categoria) throw new NotFoundException('Categoria no encontrada');
    return new SuccessResponseDto('Categria eliminada correctamente', null);
  }

}