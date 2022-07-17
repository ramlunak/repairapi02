/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, ParseIntPipe, Delete, Patch, Query, UseGuards, SetMetadata, UseFilters } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { RoleServices } from '../services/role.services';
import { Role } from '../entity/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
// import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
// import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { GlobalExceptionFilter } from 'src/filter/global-exception.filter';



@Controller('role')

@UseFilters(new GlobalExceptionFilter())
export class RoleController {

    constructor(private rolesService: RoleServices
    ) { }

    @Get()
    getAllRole(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search: string,
        @Query('field') field: string,
        @Query('order') order: number,
    ): Promise<Pagination<Role>> {
        limit = limit > 100 ? 100 : limit;
        return this.rolesService.paginate({
            page,
            limit,
            route: '/role',
        }, search, field, order);
    }

    @Get('/getAllRol')
    getAllRol(): Promise<Role[]> {
        return this.rolesService.getAllRols();
    }

    @Get('/:id')
    getRolById(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
        return this.rolesService.getRoleById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard('jwt'))
    createRole(@Body() roleDto: CreateRoleDto): Promise<MensajeModel> {
        return this.rolesService.createRole(roleDto)
    }


    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    deleteRole(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
        return this.rolesService.deleteRole(id);
    }

    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'))
    updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() rol: CreateRoleDto
    ): Promise<MensajeModel> {
        return this.rolesService.updateRol(id, rol);
    }


}
