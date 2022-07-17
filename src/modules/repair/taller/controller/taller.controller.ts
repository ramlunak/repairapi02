/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { TallerCrearDto } from '../dtos/taller-crear.dto';
import { Taller } from '../entity/taller.entity';
import { TallerService } from '../services/taller.service';

@Controller('taller')
@UseFilters(new QueryExceptionFilter(), new AllExceptionFilter())
export class TallerController {
  constructor(private readonly tallerService: TallerService) {}

  @Get('/getall')
  getTaller(@Query('idCuenta') idCuenta?: number,@Query('idRol') idRol?: number,@Query('search') search?: string): Promise<Taller[]> {  
    return this.tallerService.getAll(idCuenta, idRol,search);
  }

  @Get()
  getTarea(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('idRol') idRol: number,
    @Query('field') field: string,
    @Query('order') order: number,
    @Query('idCuenta') idCuenta: number,
  ): Promise<Pagination<Taller>> {
    limit = limit > 100 ? 100 : limit;
    return this.tallerService.paginate(
      {
        page,
        limit,
        route: '/taller',
      },
      search,
      field,
      order,
      idCuenta,
      idRol
    );
  }

  @Get('/:id')
  getOneTaller(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.tallerService.findOnTaller(id);
  }

  @Get('/clonar/:id/:idTallerBase')
  clonarTaller(@Param('id', ParseIntPipe) id: number,@Param('idTallerBase', ParseIntPipe) idTallerBase: number): Promise<MensajeModel> {    
    return this.tallerService.clonarTaller(id,idTallerBase);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  saveTaller(@Body() body) {
    return this.tallerService.saveTaller(body);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateTaller(
    @Param('id', ParseIntPipe) id: number,
    @Body() tallerDto: TallerCrearDto
    
  ): Promise<MensajeModel> {
     return this.tallerService.updateTaller(id, tallerDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteTaller(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.tallerService.deleteTaller(id);
  }
}
