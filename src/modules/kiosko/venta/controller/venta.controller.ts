import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MensajeModel } from 'src/models/mensaje.model';
import { Paginate } from 'src/models/paginate';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { VentaEntity } from '../entity/venta.entity';
import { VentaService } from '../service/venta.service';



@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createVentaDto: CreateVentaDto): Promise<MensajeModel> {
    return this.ventaService.create(createVentaDto);
  }

  @Get()
  getArticulo(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('field') field: string,
    @Query('fechai') fechai: string,
    @Query('fechaf') fechaf: string,
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,
    @Query('filtro_fecha') filtro_fecha: string,
  ): Promise<Paginate> {
    limit = limit > 100 ? 100 : limit;
    return this.ventaService.paginate( page,limit,search,field,order,idTaller,filtro_fecha,fechai,fechaf);
  }

  @Get('all')
  findAll( 
    @Query('search') search: string,
  @Query('field') field: string,
  @Query('order') order: number,
  @Query('idtaller') idTaller: number,
  @Query('filtro_fecha') filtro_fecha: string,): Promise<{data:any[]}> {
    return this.ventaService.findAll(search,field,order,idTaller,filtro_fecha);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MensajeModel>  {
    return this.ventaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto): Promise<MensajeModel> {
    return this.ventaService.update(+id, updateVentaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string): Promise<MensajeModel> {
    return this.ventaService.remove(+id);
  }
}
