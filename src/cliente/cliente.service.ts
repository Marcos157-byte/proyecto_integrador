import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Cliente } from './cliente.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';


@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
    ) {}

    // Crear cliente
    async create(createClienteDto: CreateClienteDto): Promise<Cliente | null> {
    try {
        const cliente = this.clienteRepository.create(createClienteDto);
        return await this.clienteRepository.save(cliente);
    } catch (error) {
        console.error('Error al crear el cliente', error);
        return null;
    }
    }



    async findAll(options: IPaginationOptions): Promise<Pagination<Cliente>> {
        const queryBuilder = this.clienteRepository.createQueryBuilder('cliente');
        queryBuilder.orderBy('cliente.nombre', 'ASC');
        return paginate<Cliente>(queryBuilder,options)
    }

    async findOne(id_cliente: string): Promise <Cliente | null> {
        try {
            return await this.clienteRepository.findOne({where: {id_cliente}})
        } catch (error) {
            console.error ('Error al buscar el cliente', error);
            return null;
        }
        
    }   
    async update (id_cliente: string,updateClienteDto: UpdateClienteDto): Promise<Cliente | null> {
        try {
            const cliente = await this.clienteRepository.findOne({where: {id_cliente}})
            if(!cliente) return null;
            Object.assign(cliente, updateClienteDto);
            return await this.clienteRepository.save(cliente);
        } catch (error) {
            console.error('Erro al actualizar el cliente', error);
            return null;
        }
    }
    async remove(id_cliente: string): Promise <Cliente | null> {
        try {
            const cliente = await this.clienteRepository.findOne({where: {id_cliente}});
            if(!cliente) return null;
            return await this.clienteRepository.remove(cliente);
        } catch (error) {
            console.error('Error al eliminar el cliente', error);
        return null;

        }
    }

}