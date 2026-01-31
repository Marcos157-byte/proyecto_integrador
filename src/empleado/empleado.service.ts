import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { Empleado } from "./empleado.entity";
import { QueryDto } from "src/common/dto/query.dto";
import { CreateEmpleadoDto } from "./dto/create-empleado.dto";
import { UpdateEmpleadoDto } from "./dto/update-empleado.dto";
import { SuccessResponseDto } from "src/common/dto/response.dto";

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    const empleado = this.empleadoRepository.create(createEmpleadoDto);
    const saved = await this.empleadoRepository.save(empleado);
    return new SuccessResponseDto('Empleado creado exitosamente', saved);
  }

 async findAll(query: QueryDto) {
  const { page, limit, search, searchField, sort, order } = query;
  
  const qb = this.empleadoRepository.createQueryBuilder('empleado')
    // CORRECCIÓN: El nombre en la entidad es 'usuarios' (en plural)
    .leftJoinAndSelect('empleado.usuarios', 'usuario') 
    .leftJoinAndSelect('usuario.rolUsuarios', 'rolUsuarios')
    .leftJoinAndSelect('rolUsuarios.rol', 'rol');

  if (search && searchField) {
    // Aseguramos que busque en la columna del empleado
    qb.andWhere(`empleado.${searchField} ILIKE :search`, { search: `%${search}%` });
  }

  // Ordenamiento seguro
  const sortField = sort ? `empleado.${sort}` : 'empleado.fechaCreacion';
  qb.orderBy(sortField, order ?? 'DESC');

  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return new SuccessResponseDto('Empleados obtenidos correctamente', {
    data,
    total,
    page,
    limit
  });
}
  async findOne(id_empleado: string) {
    // Incluimos relaciones también en el findOne
    const empleado = await this.empleadoRepository.findOne({
      where: { id_empleado },
      relations: ['usuario', 'usuario.rolUsuarios', 'usuario.rolUsuarios.rol']
    });
    
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return new SuccessResponseDto('Empleado encontrado correctamente', empleado);
  }

  async update(id_empleado: string, updateEmpleadoDto: UpdateEmpleadoDto) {
    const empleado = await this.empleadoRepository.findOne({ where: { id_empleado } });
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    
    Object.assign(empleado, updateEmpleadoDto);
    const updated = await this.empleadoRepository.save(empleado);
    return new SuccessResponseDto('Empleado actualizado correctamente', updated);
  }

  async remove(id_empleado: string) {
    const empleado = await this.empleadoRepository.findOne({ where: { id_empleado } });
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    
    await this.empleadoRepository.remove(empleado);
    return new SuccessResponseDto('Empleado eliminado correctamente', null);
  }

  // Este método es opcional si ya usas findAll con search, pero aquí está corregido
  async findByNombre(nombre: string) {
    const empleados = await this.empleadoRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
      relations: ['usuario'] 
    });

    if (!empleados || empleados.length === 0) {
      throw new NotFoundException("No se encontraron empleados con ese nombre");
    }

    return new SuccessResponseDto("Empleados encontrados correctamente", empleados);
  }
}