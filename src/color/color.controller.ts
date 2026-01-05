import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ColorService } from "./color.service";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";
import { QueryDto } from "src/common/dto/query.dto";

@Controller('colores')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  async create(@Body() createColorDto: CreateColorDto){
    return this.colorService.create(createColorDto);
  }

  @Get()
  async findAll(@Query() query: QueryDto){
    return this.colorService.findAll(query);
  }

  @Get(':id_color')
  async findOne(@Param('id_color') id_color:string) {
    return this.colorService.findOne(id_color);
  }

  @Put(':id_color')
  async update(@Param('id_color') id_color: string, @Body() updateColorDto:UpdateColorDto){
    return this.colorService.update(id_color,updateColorDto);
  }

  @Delete(':id_color')
  async remove(@Param('id_color') id_color:string){
    return this.colorService.remove(id_color);
  }


}