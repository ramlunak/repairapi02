/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '../entity/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';

import { Repository } from "typeorm";
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AnyRecord } from 'dns';
import { MensajeModel } from 'src/models/mensaje.model';

@Injectable()
export class RoleServices {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async getRoleById(id: number): Promise<MensajeModel> {
        const found_role = await this.roleRepository.findOne(id);
        if (!found_role) {
            throw new NotFoundException(`Rol con ID "${id}" no encontrado.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_role;
        return respuesta;
    }

    async getAllRols(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async paginate(options: IPaginationOptions, search: string, field: string, order: number): Promise<Pagination<Role>> {
        const orderby = order == 1 ? 'ASC' : 'DESC';

        const queryBuilder = this.roleRepository.createQueryBuilder('seg_rol');
        queryBuilder.andWhere('seg_rol.rol LIKE :search', { search: `%${search}%` })
        queryBuilder.orderBy(field, orderby); // Or whatever you need to do

        return paginate<Role>(queryBuilder, options);
    }

    async createRole(role: CreateRoleDto): Promise<MensajeModel> {
        const { rol } = role;
        const rol_entity = new Role();
        rol_entity.rol = rol;

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha creado un nuevo rol.'];
        respuesta.data = await rol_entity.save();
        return respuesta;
    }

    async deleteRole(id: number): Promise<MensajeModel> {
        const result = await this.roleRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Rol con ID: ${id} no encontrado.`);
        }
        
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;
    }

    async updateRol(id: number, role: CreateRoleDto): Promise<MensajeModel> {
        const { rol } = role;
        const find_rol = await this.roleRepository.findOne(id);
        find_rol.rol = rol;

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await find_rol.save();
        return respuesta;
    }

}
