import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MensajeModel } from 'src/models/mensaje.model';
import { Paginate } from 'src/models/paginate';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { UpdateCompraDto } from '../dto/update-compra.dto';
import { CompraService } from '../services/compra.service';

@Controller('compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createCompraDto: CreateCompraDto): Promise<MensajeModel>  {
    return this.compraService.create(createCompraDto);
  }

  @Get()
  getCompras(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('field') field: string,
    @Query('order') order: number,
    @Query('fechai') fechai: string,
    @Query('fechaf') fechaf: string,
    @Query('idtaller') idTaller: number,
    @Query('filtro_fecha') filtro_fecha: string,
  ): Promise<Paginate> {
    limit = limit > 100 ? 100 : limit;
    return this.compraService.paginate( page,limit,search,field,order,idTaller,filtro_fecha,fechai,fechaf);
  }

  @Get('all')
  findAll(
    @Query('search') search: string,
    @Query('field') field: string,
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,
    @Query('filtro_fecha') filtro_fecha: string,
  ): Promise<{ data: any[] }> {
    return this.compraService.findAll(
      search,
      field,
      order,
      idTaller,
      filtro_fecha,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MensajeModel>  {
    return this.compraService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateCompraDto: UpdateCompraDto): Promise<MensajeModel>  {
    return this.compraService.update(+id, updateCompraDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string): Promise<MensajeModel>  {
    return this.compraService.remove(+id);
  }
}
