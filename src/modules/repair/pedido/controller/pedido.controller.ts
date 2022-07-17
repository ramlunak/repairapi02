/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { PedidoCrearDto } from '../dtos/Pedido-crear.dto';
import { Pedido } from '../entity/pedido.entity';
import { PedidoService } from '../services/pedido.service';

@Controller('pedido')
@UseFilters(new QueryExceptionFilter(), new AllExceptionFilter())
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Get('/getall')
  getPedido(): Promise<Pedido[]> {
    return this.pedidoService.getAll();
  }

  @Get()
  getTarea(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('field') field: string,
    @Query('estado') estado: string,
    @Query('filtro_fecha') filtro_fecha: string,
    @Query('fechai') fechai: string,
    @Query('fechaf') fechaf: string,
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,
  ): Promise<Pagination<Pedido>> {
    limit = limit > 100 ? 100 : limit;
    return this.pedidoService.paginate(
      {
        page,
        limit,
        route: '/tarea',
      },
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
  getCountEstado(@Query('idTaller') idTaller: number): Promise<Pedido[]> {
    return this.pedidoService.countPorEstado(idTaller);
  }

  @Get('/:id')
  getOneImagen(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.pedidoService.findOnPedido(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  savePedido(@Body() pedidoDto: PedidoCrearDto): Promise<MensajeModel> {
    return this.pedidoService.savePedido(pedidoDto);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  updatePedido(
    @Body() pedidoDto: PedidoCrearDto,
    @Param() params,
  ): Promise<MensajeModel> {
    return this.pedidoService.updatePedido(params.id, pedidoDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deletePedido(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.pedidoService.deletePedido(id);
  }
}
