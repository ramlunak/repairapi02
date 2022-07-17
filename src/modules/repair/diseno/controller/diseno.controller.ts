/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards, Body, Put, Delete, UseFilters } from '@nestjs/common';
import { DisenoService } from '../services/diseno/diseno.service';
import { Diseno } from '../entity/diseno.entity';
import { AuthGuard } from '@nestjs/passport';
import { DisenoCrearDto } from '../dtos/diseno.crear.dto';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';

@Controller('diseno')
@UseFilters(new QueryExceptionFilter(),new AllExceptionFilter())
export class DisenoController {
   constructor(private readonly disenoService: DisenoService) { }

   @Get()
   getDiseno(): Promise<Diseno[]> {
      return this.disenoService.getAll();
   }

   @Get('/:id')
   getOneDiseno(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
      return this.disenoService.findOnDiseno(id);
   }

   @Post()
   @UseGuards(AuthGuard('jwt'))
   saveDiseno(@Body() disenoDto: DisenoCrearDto): Promise<MensajeModel> {

      return this.disenoService.saveDiseno(disenoDto);
   }

   @Put('/:id')
   @UseGuards(AuthGuard('jwt'))
   updateCuenta(@Body() disenoDto: DisenoCrearDto, @Param() params): Promise<MensajeModel> {
      return this.disenoService.updateDiseno(params.id, disenoDto);
   }

   @Delete('/:id')
   @UseGuards(AuthGuard('jwt'))
   deleteCuenta(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
      return this.disenoService.deleteDiseno(id);
   }
}
