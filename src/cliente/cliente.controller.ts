import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ClienteService } from "./cliente.service";
import { CreateClienteDto } from "./dto/create-cliente.dto";
import { UpdateClienteDto } from "./dto/update-cliente.dto";
import { QueryDto } from "src/common/dto/query.dto";
@Controller('clientes')

export class ClienteController{
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);

  }

  @Get()
  async findAll(@Query() query:QueryDto) {
    return this.clienteService.findAll(query);
  }

  @Get(':id_cliente')
  async findOne(@Param('id_cliente') id_cliente: string){
    return this.clienteService.findOne(id_cliente);
  }
  @Put(':id_cliente')
  async update(@Param('id_cliente') id_cliente:string,@Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(id_cliente, updateClienteDto);
  }
  @Delete(':id_cliente')
  async remove(@Param('id_cliente') id_cliente: string) {
    return this.clienteService.remove(id_cliente);
  }

}