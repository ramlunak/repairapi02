import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MensajeModel } from 'src/models/mensaje.model';
import { AddcantidadArticuloDto } from '../dto/addcantidad-articulo';
import { CreateArticuloDto } from '../dto/create-articulo.dto';
import { UpdateArticuloDto } from '../dto/update-articulo.dto';
import { ArticuloEntity } from '../entity/articulo.entity';
import { ArticuloService } from '../service/articulo.service';


@Controller('articulo')
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createArticuloDto: CreateArticuloDto): Promise<MensajeModel> {
    return this.articuloService.create(createArticuloDto);
  }

  @Get()
  getArticulo(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('field') field: string,
    @Query('order') order: number,
    @Query('idtaller') idTaller: number,
  ): Promise<Pagination<ArticuloEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this.articuloService.paginate(
      {
        page,
        limit,
        route: '/articulo',
      },
      search,
      field,
      order,
      idTaller
    );
  }

  @Get('all')
  findAll(): Promise<ArticuloEntity[]> {
    return this.articuloService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MensajeModel> {
    return this.articuloService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateArticuloDto: UpdateArticuloDto): Promise<MensajeModel> {
    return this.articuloService.update(+id, updateArticuloDto);
  }

  @Patch('add/:id')
  @UseGuards(AuthGuard('jwt'))
  updateCantidad(@Param('id') id: string, @Body() addCantidadArticuloDto: AddcantidadArticuloDto): Promise<MensajeModel> {
    return this.articuloService.addCantidad(+id, addCantidadArticuloDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string): Promise<MensajeModel> {
    return this.articuloService.remove(+id);
  }
}
