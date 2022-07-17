import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ConfiguracionService } from '../services/configuracion.service';
import { CreateConfiguracionDto } from '../dtos/create-configuracion.dto';
import { UpdateConfiguracionDto } from '../dtos/update-configuracion.dto';
import { MensajeModel } from 'src/models/mensaje.model';
import { Configuracion } from '../entity/configuracion.entity';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Post()
  create(@Body() createConfiguracionDto: CreateConfiguracionDto):Promise<MensajeModel> {
    return this.configuracionService.create(createConfiguracionDto);
  }

  @Get()
  findAll(): Promise<Configuracion>{
    return this.configuracionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string):Promise<MensajeModel>  {
    return this.configuracionService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() createConfiguracionDto: CreateConfiguracionDto):Promise<MensajeModel>  {
    return this.configuracionService.update(+id, createConfiguracionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string):Promise<MensajeModel>  {
    return this.configuracionService.remove(+id);
  }
}
