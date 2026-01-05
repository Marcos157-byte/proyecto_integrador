import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Cliente } from './cliente.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>
    ) {}

    async create(createClienteDto: CreateClienteDto) {
        const cliente = this.clienteRepository.create(createClienteDto);
        const saved = await this.clienteRepository.save(cliente);
        return new SuccessResponseDto('Cliente creado correctamente', saved)
    }
    async findAll(query: QueryDto) {
        const {page, limit, search, searchField, sort, order} = query;

        const qb = this.clienteRepository.createQueryBuilder('cliente')
        .skip((page -1) * limit)
        .take(limit);

        if(search && searchField) {
            qb.andWhere(`cliente.${searchField} LIKE: search`, {search: `${search}`});
        }
        if (sort) {
            qb.orderBy(`cliente.${sort}`, order ?? 'ASC');

        }
        const [data, total] = await qb.getManyAndCount();

        return new SuccessResponseDto('Clientes obtenidos correctamente', {
            data,
            total,
            page,
            limit,
        });
    }
    async findOne(id_cliente:string) {
        const cliente = await this.clienteRepository.findOne({
            where: {id_cliente}, relations: ['ventas']
        });
        if(!cliente) throw new NotFoundException('Cliente no encontrado');
        return new SuccessResponseDto('Cliente encontrado exitosamente', cliente);
    }
    async update(id_cliente:string, updateClienteDto:UpdateClienteDto) {
        const cliente = await this.clienteRepository.findOne({where: {id_cliente}});
        if(!cliente) throw new NotFoundException('Cliente no encontrado');
        Object.assign(cliente, updateClienteDto);
        const update = await this.clienteRepository.save(cliente);

        return new SuccessResponseDto('Cliente actualizado correctamente', update);
    }
    async remove(id_cliente:string) {
        const cliente = await this.clienteRepository.findOne({where: {id_cliente}});
        if(!cliente) throw new NotFoundException('Cliente no encontrado');
        const eliminar = await this.clienteRepository.remove(cliente);
        return new SuccessResponseDto('Cliente eliminado con exito',null );
    }

}