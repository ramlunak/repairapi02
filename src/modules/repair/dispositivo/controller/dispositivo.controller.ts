/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { DispositivoCrearDto } from '../dtos/dispositivo-crear.dto';
import { Dispositivo } from '../entity/dispositivo.entity';
import { DispositivoService } from '../services/dispositivo.service';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { AsignarMarcaDispositivoDto } from '../entity/asignar-marca-dispositivo.dto';

@Controller('dispositivo')
@UseFilters(new QueryExceptionFilter(),new AllExceptionFilter())
export class DispositivoController {
   constructor(private readonly dispositivoService: DispositivoService) { }

   @Get()
   getDispositivo( @Query('idTaller') idTaller?: number,): Promise<Dispositivo[]> {
      return this.dispositivoService.getAll(idTaller);
   }

   @Get('/getdispositivoactivo')
   getDispositivoActivo( @Query('idTaller') idTaller?: number,): Promise<Dispositivo[]> {
      return this.dispositivoService.getActivo(idTaller);
   }

   @Get('/:id')
   getOneImagen(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
      return this.dispositivoService.findOnDispositivo(id);
   }

   @Post()
   @UseInterceptors(FileInterceptor('imagen', {
      fileFilter: (req, file, callback) => {
         if (!file.originalname.match(/\.(jpg|jepg|png|gif)$/)) {
            return callback(new NotFoundException(`Solo se puede seleccionar imagenes`), false);
         }
         callback(null, true);
      }
   }))
   @UseGuards(AuthGuard('jwt'))
   saveDispositivo(@Body() body): Promise<MensajeModel> {      
      return this.dispositivoService.saveDispositivo(body);
   }

   @Post('asignarmarca') 
   @UseGuards(AuthGuard('jwt'))
   aignarMarca(@Body() asignarMarcaDto: AsignarMarcaDispositivoDto): Promise<MensajeModel> {         
      return this.dispositivoService.asignarMarcaDispositivo(asignarMarcaDto);
   }


   @Put('/:id')
   @UseGuards(AuthGuard('jwt'))
   updateDispositivo(@Body() dispositivoDto: DispositivoCrearDto, @Param() params): Promise<MensajeModel> {
      return this.dispositivoService.updateDispositivo(params.id, dispositivoDto);
   }

   @Patch('/:id')
   @UseGuards(AuthGuard('jwt'))
   updateEstadoDispositivo(@Body() dispositivoDto: DispositivoCrearDto, @Param() params): Promise<MensajeModel> {
      return this.dispositivoService.updateEstadoDispositivo(+params.id, dispositivoDto);
   }

   @Delete('/:id')
   @UseGuards(AuthGuard('jwt'))
   deleteDispositivo(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
      return this.dispositivoService.deleteDispositivo(id);
   }
}
