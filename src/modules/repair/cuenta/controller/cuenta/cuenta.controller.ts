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
import { CuentaCrearDto } from '../../dtos/cuenta.crear.dto';
import { CuentaService } from '../../services/cuenta/cuenta.service';
import { Cuenta } from '../../entity/cuenta.entity';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('cuenta')
@UseFilters(new QueryExceptionFilter(), new AllExceptionFilter())
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  @Get()
  getCuenta(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('field') field: string,
    @Query('order') order: number,
  ): Promise<Pagination<Cuenta>> {
    limit = limit > 100 ? 100 : limit;
    return this.cuentaService.paginate(
      {
        page,
        limit,
        route: '/cuenta',
      },
      search,
      field,
      order,
    );
  }

  @Get('/getallcuentas')
  getAllCuentas(): Promise<Cuenta[]> {
   return this.cuentaService.getAll();
 }

  @Get('/:id')
  getOneCuenta(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.cuentaService.findOnCuenta(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  saveCuenta(@Body() dto: CuentaCrearDto): Promise<MensajeModel> {
    console.log(dto);
    return this.cuentaService.saveCuenta(dto);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  updateCuenta(
    @Body() dto: CuentaCrearDto,
    @Param() params,
  ): Promise<MensajeModel> {
    return this.cuentaService.updateCuenta(params.id, dto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteCuenta(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
    return this.cuentaService.deleteCuenta(id);
  }
}
