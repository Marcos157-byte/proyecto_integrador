import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PaginateModel } from "mongoose";
import { Talla } from "./talla.schema";
import { SuccessResponseDto } from "src/common/dto/response.dto";
import { QueryDto } from "src/common/dto/query.dto";

@Injectable()
export class TallaService {
  constructor(
    @InjectModel(Talla.name)
    private readonly tallaModel: Model<Talla>
  ) {}

  // Crear talla
  async create(createTallaDto: Partial<Talla>) {
    const talla = new this.tallaModel(createTallaDto);
    const saved = await talla.save();
    return new SuccessResponseDto('Talla creada correctamente', saved);
  }

  // Listar tallas con paginación
  async findAll(query: QueryDto) {
    const { page, limit, search, searchField, sort, order } = query;

    const options: any = {
      page,
      limit,
      sort: sort ? { [sort]: order ?? 'ASC' } : undefined,
    };

    const filter: any = {};
    if (search && searchField) {
      filter[searchField] = { $regex: search, $options: 'i' };
    }

    const result = await (this.tallaModel as PaginateModel<Talla>).paginate(filter, options);

    return new SuccessResponseDto('Tallas obtenidas correctamente', result);
  }

  // Buscar talla por ID
  async findOne(id_talla: string) {
    const talla = await this.tallaModel.findOne({ id_talla }).exec();
    if (!talla) throw new NotFoundException('Talla no encontrada');
    return new SuccessResponseDto('Talla encontrada', talla);
  }

  // Actualizar talla
  async update(id_talla: string, updateTallaDto: Partial<Talla>) {
    const talla = await this.tallaModel.findOneAndUpdate(
      { id_talla },
      updateTallaDto,
      { new: true },
    ).exec();

    if (!talla) throw new NotFoundException('Talla no encontrada');
    return new SuccessResponseDto('Talla actualizada correctamente', talla);
  }

  // Eliminar talla
  async remove(id_talla: string) {
    const talla = await this.tallaModel.findOneAndDelete({ id_talla }).exec();
    if (!talla) throw new NotFoundException('Talla no encontrada');
    return new SuccessResponseDto('Talla eliminada correctamente', null);
  }
}