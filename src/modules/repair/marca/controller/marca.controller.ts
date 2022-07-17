/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { MarcaCrearDto } from '../dtos/marca-crear-dto';
import { UpdateEstadoDto } from '../dtos/update-estado.dto';
import { MarcaEntity } from '../entity/marca.entity';
import { MarcaService } from '../services/marca.service';

@Controller('marca')
@UseFilters(new QueryExceptionFilter(),new AllExceptionFilter())
export class MarcaController {
    constructor(private readonly marcaService: MarcaService) { }

    @Get('marcasasignadas/:id/:idTaller')
    getMarcaEntity(@Param('id', ParseIntPipe) iddispositivo: number,@Param('idTaller', ParseIntPipe) idTaller: number): Promise<MensajeModel> {
        return this.marcaService.getMarcaAsignadas(iddispositivo,idTaller);
    }

    @Get()
    getAll(): Promise<MarcaEntity[]> {
        return this.marcaService.getAll();
    }

    @Get('/:id')
    getOneMarcaEntity(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
        return this.marcaService.findOnMarca(id);
    }

    @Get('getmarcastaller/:idtaller')
    getMarcaTaller(@Param('idtaller', ParseIntPipe) idtaller: number): Promise<MensajeModel> {
        return this.marcaService.findMarcaOnTaller(idtaller);
    }

    @Get('getmarcadispositivo/:id/:idtaller')
    findMarcaOnDispositivo(@Param('id', ParseIntPipe) id: number,@Param('idtaller', ParseIntPipe) idTaller: number): Promise<MensajeModel> {
        return this.marcaService.findMarcaOnDispositivo(id,idTaller);
    }

    @Post()   
    @UseGuards(AuthGuard('jwt'))
    saveMarcaEntity(@Body() marcaDto: MarcaCrearDto): Promise<MensajeModel>  {
        
        return this.marcaService.saveMarca(marcaDto);
    }


    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'))
    updateMarcaEntity(@Body() marcaDto: MarcaCrearDto, @Param() params): Promise<MensajeModel>  {
        return this.marcaService.updateMarca(params.id, marcaDto);
    }

    @Patch('/updateestado/:id')
    @UseGuards(AuthGuard('jwt'))
    updateEstado(@Body() updateEstadoDto: UpdateEstadoDto, @Param() params): Promise<MensajeModel>  {
        return this.marcaService.updateEstadoMarca(params.id, updateEstadoDto);
    }

    @Delete('/:id/:iddispositivo')
    @UseGuards(AuthGuard('jwt'))
    deleteMarcaEntity(@Param('id', ParseIntPipe) id: number, @Param('iddispositivo', ParseIntPipe) iddispositivo: number): Promise<MensajeModel> {
        return this.marcaService.deleteMarca(id,iddispositivo);
    }
}
