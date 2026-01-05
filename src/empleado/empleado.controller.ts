import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { EmpleadoService } from "./empleado.service";
import { CreateEmpleadoDto } from "./dto/create-empleado.dto";
import { UpdateEmpleadoDto } from "./dto/update-empleado.dto";
import { QueryDto } from "src/common/dto/query.dto";
@Controller('empleados')

export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  async create(@Body()createEmpleadoDto:CreateEmpleadoDto){
    return this.empleadoService.create(createEmpleadoDto);
  }
  @Get()
  async findAll(@Query() query:QueryDto){
    return this.empleadoService.findAll(query);
  }
  @Get(':id_empleado')
  async findOne(@Param('id_empleado') id_empleado:string){
    return this.empleadoService.findOne(id_empleado);
  }

  @Put(':id_empleado')
  async update(@Param('id_empleado') id_empleado:string, @Body() updateEmpleadoDto:UpdateEmpleadoDto){
    return this.empleadoService.update(id_empleado,updateEmpleadoDto);

  }
  @Delete(':id_empleado')
  async remove(@Param('id_empleado') id_empleado:string) {
    return this.empleadoService.remove(id_empleado);
  }
}
