import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Res,
  Response,
  StreamableFile,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { createReadStream } from 'fs';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { Paginate } from 'src/models/paginate';
import { Readable } from 'stream';

import { OrdenCrearDto } from '../../dtos/orden.crear.dto';
import { OrdenPrintDto } from '../../dtos/orden.print.dto';
import { OrdenEntity } from '../../entity/orden.entity';
import { OrdenService } from '../../services/orden.service';

@Controller('orden')
@UseFilters(new QueryExceptionFilter())
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Get('/imprimirpdf')
  //@UseGuards(AuthGuard('jwt')) 
 
  
 imprimirPdf(@Query('idOrden') idOrden: number, @Query('inc') inc: number): Promise<MensajeModel>{  
    return this.ordenService.imprimirPdf(idOrden, inc);
       
 }

  @Get()
  getOrden(
    @Query('page') page=1,
    @Query('limit') limit=100,
    @Query('search') search: string,
    @Query('estado') estado: number,
    @Query('field') field: string,
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,
  ): Promise<Pagination<OrdenEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this.ordenService.paginate(
      {
        page,
        limit,
        route: '/orden',
      },
      search,
      field,
      order,
      idTaller,
      estado
    );
  }

  @Get('/getordenporestado')
  getOrdenPorEstado(
    @Query('page') page=1,
    @Query('limit') limit=100,
    @Query('search') search: string,
    @Query('filtro_fecha') filtro_fecha: string,
    @Query('estado') estado: number,
    @Query('field') field: string,
    @Query('fechai') fechai: string,
    @Query('fechaf') fechaf: string,
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,    
  ): Promise<Paginate> {
    limit = limit > 100 ? 100 : limit;
    return this.ordenService.paginatePorEstado(      
        page,
        limit,    
        search,
        field,
        order,
        idTaller,
        estado,
        filtro_fecha,
        fechai,fechaf
    );
  }

  @Get('/enviarfactura')
  enviarFactura( @Query('idOrden') idOrden: number): Promise<MensajeModel> {
    return this.ordenService.reenviarFactura(idOrden)
  }

  @Get('/getAll')
  getall(): Promise<OrdenEntity[]> {
    return this.ordenService.getAll();
  }

  @Get('/getpororden')
  getPorTaller( @Query('idTaller') idTaller: number,
  @Query('idOrden') idOrden: number): Promise<MensajeModel> {
    return this.ordenService.findOnOrden(idOrden,idTaller);
  }


  @Get('getporestado')
  getCountEstado(
    @Query('idTaller') idTaller: number
  ): Promise<OrdenEntity[]> {
    return this.ordenService.countPorEstado(idTaller);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  saveOrden(@Body() body): Promise<MensajeModel> {
    //console.log(body);
    return this.ordenService.saveOrden(body);
  }

 
 


  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateOrden(
    @Body() dto: OrdenCrearDto,
    @Param() params,
  ): Promise<MensajeModel> {
    return this.ordenService.updateOrden(params.id, dto);
  }
}
