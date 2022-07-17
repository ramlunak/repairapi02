import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { ModeloCrearDto } from '../dtos/modelo-crear-dto';
import { ModeloEntity } from '../entity/modelo.entity';
import { ModeloService } from '../services/modelo.service';

@Controller('modelo')
@UseFilters(new QueryExceptionFilter(),new AllExceptionFilter())
export class ModeloController {
    constructor(private readonly modeloService: ModeloService) { }

    @Get('')
    getAllModelos(): Promise<ModeloEntity[]> {
     return this.modeloService.getAll();
   }
  
    @Get('/:id')
    getOneModelo(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
      return this.modeloService.findOnModelo(id);
    }

    @Get('/getpormarcas/:id/:iddispositivo')
    getOnMarca(@Param('id', ParseIntPipe) idmarca: number,@Param('iddispositivo', ParseIntPipe) iddispositivo: number): Promise<MensajeModel> {
      return this.modeloService.findOnMarcaDispositivo(idmarca,iddispositivo);
    }
  
    @Post()
    @UseGuards(AuthGuard('jwt'))
    saveModelo(@Body() dto: ModeloCrearDto): Promise<MensajeModel> {      
      return this.modeloService.saveModelo(dto);
    }
  
    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'))
    updateModelo(
      @Body() dto: ModeloCrearDto,
      @Param() params,
    ): Promise<MensajeModel> {
      return this.modeloService.updateModelo(params.id, dto);
    }

    @Patch('/updateestado/:id')
    @UseGuards(AuthGuard('jwt'))
    updateEstado(
      @Body() dto: ModeloCrearDto,
      @Param() params,
    ): Promise<MensajeModel> {
      return this.modeloService.updateEstado(params.id, dto);
    }
  
    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    deleteModelo(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
      return this.modeloService.deleteModelo(id);
    }
}