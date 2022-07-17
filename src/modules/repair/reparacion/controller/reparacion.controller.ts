import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { ReparacionUpdateDto } from '../dtos/reparacion-update.dto';
import { ReparacionEntity } from '../entity/reparacion.entity';
import { ReparacionService } from '../services/reparacion.service';

@Controller('reparacion')
@UseFilters(new QueryExceptionFilter(),new AllExceptionFilter())
export class ReparacionController {
    constructor(private readonly reparacionService: ReparacionService) { }

    @Get('reparacionasignadas/:idmodelo')
    getReparacionEntity(@Param('idmodelo', ParseIntPipe) idmodelo: number): Promise<MensajeModel> {
        return this.reparacionService.getReparacionAsignadas(idmodelo);
    }

    @Get()
    getAll(): Promise<ReparacionEntity[]> {
        return this.reparacionService.getAll();
    }

    @Get('/:id')
    getOneReparacion(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
        return this.reparacionService.findOnReparacion(id);
    }

    @Get('/getreparacionpormodelo/:idmodelo')
    findReparacionOnModelo(@Param('idmodelo', ParseIntPipe) idmodelo: number): Promise<MensajeModel> {
        return this.reparacionService.findReparacionOnModelo(idmodelo);
    }

    @Get('/getreparacionpororden/:idorden')
    findReparacionOnOrden(@Param('idorden', ParseIntPipe) idOrden: number): Promise<MensajeModel> {
        return this.reparacionService.findReparacionOnOrden(idOrden);
    }

    @Post()   
    @UseGuards(AuthGuard('jwt'))
    saveReparacionEntity(@Body() body): Promise<MensajeModel>  {        
        return this.reparacionService.saveReparacion(body);
    }


    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'))
    updateReparacionEntity(@Body() reparUpdateDto: ReparacionUpdateDto, @Param() params): Promise<MensajeModel>  {
        return this.reparacionService.updateReparacion(params.id, reparUpdateDto);
    }

    @Patch('/updateEstado/:id')
    @UseGuards(AuthGuard('jwt'))
    updateEstadoReparacion(@Body() reparUpdateDto: ReparacionUpdateDto, @Param() params): Promise<MensajeModel>  {
        return this.reparacionService.updateEstadoReparacion(params.id, reparUpdateDto);
    }

    @Patch('/updatePrecio/:id')
    @UseGuards(AuthGuard('jwt'))
    updatePrecioReparacion(@Body() reparUpdateDto: ReparacionUpdateDto, @Param() params): Promise<MensajeModel>  {
        return this.reparacionService.updatePrecioReparacion(params.id, reparUpdateDto);
    }

    @Delete('/:id/:idmodelo')
    @UseGuards(AuthGuard('jwt'))
    deleteReparacionEntity(@Param('id', ParseIntPipe) id: number, @Param('idmodelo', ParseIntPipe) idmodelo: number): Promise<MensajeModel> {
        return this.reparacionService.deleteReparacion(id,idmodelo);
    }
}