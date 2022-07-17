/* eslint-disable prettier/prettier */
import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
  Delete,
  UseFilters,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClienteCrearDto } from '../dtos/cliente.crear.dto';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../entity/cliente.entity';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('cliente')
@UseFilters(new QueryExceptionFilter(), new AllExceptionFilter())
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  getCliente(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('field') field: string,
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,
  ): Promise<Pagination<Cliente>> {
    limit = limit > 100 ? 100 : limit;
    return this.clienteService.paginate(
      {
        page,
        limit,
        route: '/cliente',
      },
      search,
      field,
      order,
      idTaller
    );
  }

  @Get('/getallclientes')
  getAllClientes(): Promise<Cliente[]> {
   return this.clienteService.getAll();
  }

  @Get('/getClientePorTelefono')
  getClientePorNOmbre(@Query('search') search: string,@Query('idtaller') idTaller: number): Promise<Cliente> {
   return this.clienteService.getClientePorTelefono(search,idTaller);
 }

  @Get('/:id')
  getOneCliente(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.clienteService.findOnCliente(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  saveCliente(@Body() dto: ClienteCrearDto): Promise<MensajeModel> {
    console.log(dto);
    return this.clienteService.saveCliente(dto);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateCliente(
    @Body() dto: ClienteCrearDto,
    @Param() params,
  ): Promise<MensajeModel> {
    return this.clienteService.updateCliente(params.id, dto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteCliente(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.clienteService.deleteCliente(id);
  }
}
