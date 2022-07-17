/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { Paginate } from 'src/models/paginate';
import { TareaCrearDto } from '../dtos/tarea.crear.dto';
import { TareaEstadoDto } from '../dtos/tarea.estado.dto';
import { Tarea } from '../entity/tarea.entity';
import { TareaService } from '../services/tarea.service';

@Controller('tarea')
@UseFilters(new QueryExceptionFilter(), new AllExceptionFilter())
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Get('/getall')
  getTareaAll(): Promise<Tarea[]> {
    return this.tareaService.getAll();
  }

  @Get()
  getTarea(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('estado') estado: number,
    @Query('field') field: string,    
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,
  ): Promise<Pagination<Tarea>> {
    limit = limit > 100 ? 100 : limit;
    return this.tareaService.paginate(
      {
        page,
        limit,
        route: '/tarea',
      },
      search,
      field,
      order,
      idTaller,
      estado
    );
  }

  @Get('/tareapaginadas')
  getTareaPaginadas(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('estado') estado: string,
    @Query('filtro_fecha') filtro_fecha: string,
    @Query('field') field: string,
    @Query('fechai') fechai: string,
    @Query('fechaf') fechaf: string,
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,
  ): Promise<Paginate> {
    limit = limit > 100 ? 100 : limit;
    return this.tareaService.getTareaPaginado(
      page,
      limit,
      search,
      field,
      order,
      idTaller,
      +estado,
      filtro_fecha,
      fechai,fechaf
    );
  }

  @Get('/getporestado')
  getCountEstado(@Query('idTaller') idTaller: number): Promise<Tarea[]> {    
    return this.tareaService.countPorEstado(idTaller);
  }

  @Get('/getpororden')
  getTareaOrden(@Query('idOrden') idOrden: number): Promise<Tarea[]> {
    
    return this.tareaService.getTareaPorOrden(idOrden);
  }

  

  @Get('/:id')
  getOneTarea(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.tareaService.findOnTarea(id);
  }  

  @Post()
  @UseGuards(AuthGuard('jwt'))
  saveTarea(@Body() tareaDto: TareaCrearDto) {
    return this.tareaService.saveTarea(tareaDto);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateTarea(
    @Body() tareaDto: TareaCrearDto,
    @Param() params,
  ): Promise<MensajeModel> {
    return this.tareaService.updateTarea(params.id, tareaDto);
  }

  @Patch('/updateestado/:id')
  @UseGuards(AuthGuard('jwt'))
  updateEstado(
    @Body() tareaestadoDto: TareaCrearDto,
    @Param() params,
  ): Promise<MensajeModel> {
    return this.tareaService.updateEstado(params.id, tareaestadoDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteTarea(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.tareaService.deleteTarea(id);
  }
}
