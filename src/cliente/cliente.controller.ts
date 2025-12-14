import {  Controller, Get, Post, Put, Delete, Body, Param,
  Query, BadRequestException, NotFoundException,
  UseInterceptors, UploadedFile,
  InternalServerErrorException } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryDto } from 'src/common/dto/query.dto';
import { diskStorage } from 'multer';
import { UpdateClienteDto } from './dto/update-cliente.dto';
@Controller('cliente')
export class ClienteController {

    constructor (private readonly clienteService: ClienteService){}

    @Post()
    async create(@Body() dto: CreateClienteDto) {
        const cliente = await this.clienteService.create(dto);
        return new SuccessResponseDto('Cloiente credo con seguridad', cliente );
    }

  @Get()
async findAll(
  @Query() query: QueryDto,
): Promise<SuccessResponseDto<Pagination<Cliente>>> {
  if (query.limit && query.limit > 100) {
    query.limit = 100;
  }

  const result = await this.clienteService.findAll(query);

  if (!result) throw new InternalServerErrorException('Could not retrieve clientes');

  return new SuccessResponseDto('Clientes retrieved successfully', result);
}
    @Get(':id_cliente')
    async findOne(@Param('id_cliente') id_cliente: string) {
        const cliente = await this.clienteService.findOne(id_cliente)
        if(!cliente) throw new NotFoundException('User not found');
        return new SuccessResponseDto('User retrieved successfully', cliente);
    }

    @Put(':id_cliente')
    async update(@Param('id_cliente') id_cliente: string, @Body() dto:UpdateClienteDto) {
        const cliente = await this.clienteService.update(id_cliente, dto)
        if (!cliente) throw new NotFoundException('Cliente no Registrado');
        return new SuccessResponseDto('Cliente actualizado con exito', cliente);
    }

    
  @Delete(':id_cliente')
  async remove(@Param('id_cliente') id_cliente: string) {
    const cliente = await this.clienteService.remove(id_cliente);
    if (!cliente) throw new NotFoundException('User not found');
    return new SuccessResponseDto('User deleted successfully', cliente);
  }
    
     


}
