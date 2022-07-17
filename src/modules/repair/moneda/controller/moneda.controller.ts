/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards, Body, Put, Delete, UseFilters } from '@nestjs/common';
import { MonedaService } from '../services/moneda.service';
import { Moneda } from '../entity/moneda.entity';
import { AuthGuard } from '@nestjs/passport';
import { MonedaCrearDto } from '../dtos/moneda.crear.dto';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';

@Controller('moneda')
@UseFilters(new QueryExceptionFilter(),new AllExceptionFilter())
export class MonedaController {
    constructor(private readonly monedaService: MonedaService) { }

    @Get()   
    getMoneda(): Promise<Moneda[]> {
       return this.monedaService.getAll();
    }
 
    @Get('/:id')   
    getOneMoneda(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
       return this.monedaService.findOnMoneda(id);
    }
 
    @Post()
    @UseGuards(AuthGuard('jwt'))
    saveDiseno(@Body() monedaoDto: MonedaCrearDto): Promise<MensajeModel>{
       
       return this.monedaService.saveMoneda(monedaoDto);
    }
 
    @Put('/:id')
    @UseGuards(AuthGuard('jwt'))
    updateMoneda(@Body() monedaoDto: MonedaCrearDto, @Param() params): Promise<MensajeModel> {
       return this.monedaService.updateMoneda(params.id, monedaoDto);
    }
 
    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    deleteMoneda(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
       return this.monedaService.deleteMoneda(id);
    }
}
